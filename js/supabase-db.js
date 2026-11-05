/**
 * Módulo de Integración con Supabase para Moonshine Kaizen
 * Persistencia en la nube PostgreSQL y sincronización en tiempo real automática.
 */
(function () {
  'use strict';

  const STATE_ROW_ID = 'current_state';

  let client = null;
  let realtimeChannel = null;
  let saveDebounceTimer = null;
  let isSaving = false;
  let lastSavedTimestamp = null;
  let isSyncingFromRemote = false;

  function getConfig() {
    if (window.MOONSHINE_SUPABASE_CONFIG && 
        window.MOONSHINE_SUPABASE_CONFIG.url && 
        window.MOONSHINE_SUPABASE_CONFIG.anonKey) {
      return {
        url: window.MOONSHINE_SUPABASE_CONFIG.url.trim(),
        anonKey: window.MOONSHINE_SUPABASE_CONFIG.anonKey.trim()
      };
    }
    return { url: '', anonKey: '' };
  }

  function isConfigured() {
    const cfg = getConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('https://'));
  }

  function initClient() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('La biblioteca Supabase JS no está disponible.');
      return null;
    }

    const cfg = getConfig();
    if (!cfg.url || !cfg.anonKey) {
      return null;
    }

    try {
      client = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return client;
    } catch (e) {
      console.error('Error al inicializar cliente Supabase:', e);
      client = null;
      return null;
    }
  }

  async function fetchRemoteState() {
    if (!client && !initClient()) return null;

    try {
      const { data, error } = await client
        .from('moonshine_state')
        .select('data, updated_at')
        .eq('id', STATE_ROW_ID)
        .maybeSingle();

      if (error) {
        console.error('Error al consultar Supabase:', error);
        return null;
      }

      if (data && data.data) {
        lastSavedTimestamp = data.updated_at;
        return data.data;
      }

      return null;
    } catch (e) {
      console.error('Excepción al consultar Supabase:', e);
      return null;
    }
  }

  async function saveRemoteState(stateObj, immediate = false) {
    if (!client && !initClient()) return;

    if (isSyncingFromRemote) {
      return;
    }

    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = null;
    }

    const executeSave = async () => {
      try {
        isSaving = true;

        const payload = {
          isAdmin: false,
          operators: stateObj.operators || [],
          materials: stateObj.materials || [],
          structures: stateObj.structures || [],
          productionRecords: stateObj.productionRecords || [],
          auditLog: stateObj.auditLog || []
        };

        const now = new Date().toISOString();
        const { error } = await client
          .from('moonshine_state')
          .upsert({
            id: STATE_ROW_ID,
            data: payload,
            updated_at: now
          }, { onConflict: 'id' });

        if (error) {
          console.error('Error al guardar en Supabase:', error);
        } else {
          lastSavedTimestamp = now;
        }
      } catch (err) {
        console.error('Excepción al guardar en Supabase:', err);
      } finally {
        isSaving = false;
      }
    };

    if (immediate) {
      await executeSave();
    } else {
      saveDebounceTimer = setTimeout(executeSave, 1000);
    }
  }

  function subscribeRealtime(onRemoteUpdateCallback) {
    if (!client && !initClient()) return;

    try {
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
      }

      realtimeChannel = client
        .channel('moonshine_state_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'moonshine_state',
            filter: `id=eq.${STATE_ROW_ID}`
          },
          (payload) => {
            const newRecord = payload.new;
            if (!newRecord || !newRecord.data) return;

            if (newRecord.updated_at === lastSavedTimestamp) {
              return;
            }

            console.log('🔄 Actualización recibida desde Supabase Realtime');
            lastSavedTimestamp = newRecord.updated_at;
            isSyncingFromRemote = true;

            try {
              if (typeof onRemoteUpdateCallback === 'function') {
                onRemoteUpdateCallback(newRecord.data);
              }
            } finally {
              setTimeout(() => { isSyncingFromRemote = false; }, 300);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('No se pudo suscribir a Supabase Realtime:', e);
    }
  }

  // API Pública
  window.MoonshineSupabase = {
    getConfig,
    isConfigured,
    initClient,
    fetchRemoteState,
    saveRemoteState,
    subscribeRealtime
  };
})();
