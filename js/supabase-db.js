/**
 * Módulo de Integración con Supabase para Moonshine Kaizen
 * Administra la persistencia en la nube PostgreSQL y la sincronización en tiempo real.
 */
(function () {
  'use strict';

  const STORAGE_CONFIG_KEY = 'MOONSHINE_SUPABASE_STORED_CONFIG';
  const STATE_ROW_ID = 'current_state';

  let client = null;
  let realtimeChannel = null;
  let saveDebounceTimer = null;
  let isSaving = false;
  let lastSavedTimestamp = null;
  let isSyncingFromRemote = false;

  function getConfig() {
    // 1. Intentar leer de localStorage (si el usuario lo configuró desde la UI)
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.anonKey) {
          return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
        }
      }
    } catch (e) {
      console.warn('No se pudo leer configuración local de Supabase:', e);
    }

    // 2. Intentar leer de window.MOONSHINE_SUPABASE_CONFIG
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

  function setConfig(url, anonKey) {
    const cleanUrl = (url || '').trim();
    const cleanKey = (anonKey || '').trim();
    
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify({
      url: cleanUrl,
      anonKey: cleanKey
    }));

    if (window.MOONSHINE_SUPABASE_CONFIG) {
      window.MOONSHINE_SUPABASE_CONFIG.url = cleanUrl;
      window.MOONSHINE_SUPABASE_CONFIG.anonKey = cleanKey;
    }

    return initClient();
  }

  function clearConfig() {
    localStorage.removeItem(STORAGE_CONFIG_KEY);
    if (window.MOONSHINE_SUPABASE_CONFIG) {
      window.MOONSHINE_SUPABASE_CONFIG.url = '';
      window.MOONSHINE_SUPABASE_CONFIG.anonKey = '';
    }
    client = null;
    if (realtimeChannel) {
      try { realtimeChannel.unsubscribe(); } catch (_) {}
      realtimeChannel = null;
    }
    updateBadge('Modo Local', 'badge-warning', 'Operando sin sincronización en la nube');
  }

  function isConfigured() {
    const cfg = getConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('https://'));
  }

  function initClient() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('La biblioteca Supabase JS no está cargada aún.');
      updateBadge('Sin SDK', 'badge-danger', 'No se cargó supabase.js');
      return null;
    }

    const cfg = getConfig();
    if (!cfg.url || !cfg.anonKey) {
      client = null;
      updateBadge('Modo Local', 'badge-warning', 'Configura Supabase para sincronizar');
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
      updateBadge('Error Conexión', 'badge-danger', e.message);
      client = null;
      return null;
    }
  }

  function updateBadge(text, badgeClass = 'badge-neutral', title = '') {
    const badge = document.getElementById('supabase-status-badge');
    if (!badge) return;

    badge.className = `badge ${badgeClass}`;
    badge.textContent = text;
    if (title) badge.title = title;
  }

  async function testConnection(testUrl, testKey) {
    if (!window.supabase) {
      throw new Error('La librería Supabase JS no está cargada.');
    }

    const url = (testUrl || '').trim();
    const key = (testKey || '').trim();

    if (!url || !key) {
      throw new Error('Debes ingresar la URL del proyecto y la Clave Anon.');
    }

    if (!url.startsWith('https://')) {
      throw new Error('La URL debe comenzar con https://');
    }

    const tempClient = window.supabase.createClient(url, key, {
      auth: { persistSession: false }
    });

    // Probar consultar la tabla moonshine_state
    const { data, error } = await tempClient
      .from('moonshine_state')
      .select('id, updated_at')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        throw new Error('Conexión exitosa, pero la tabla "moonshine_state" aún no existe en Supabase. Ejecuta el script SQL en Supabase primero.');
      }
      throw new Error(error.message || 'Error al conectar con Supabase');
    }

    return { success: true, count: data ? data.length : 0 };
  }

  async function fetchRemoteState() {
    if (!client && !initClient()) return null;

    try {
      updateBadge('Sincronizando...', 'badge-info', 'Descargando datos de Supabase...');
      const { data, error } = await client
        .from('moonshine_state')
        .select('data, updated_at')
        .eq('id', STATE_ROW_ID)
        .maybeSingle();

      if (error) {
        console.error('Error al descargar estado desde Supabase:', error);
        updateBadge('Error Nube', 'badge-danger', error.message);
        return null;
      }

      if (data && data.data) {
        lastSavedTimestamp = data.updated_at;
        updateBadge('Nube Activa', 'badge-success', `Sincronizado: ${new Date(data.updated_at).toLocaleTimeString()}`);
        return data.data;
      }

      updateBadge('Nube Lista', 'badge-success', 'Base de datos conectada (sin registros previos)');
      return null;
    } catch (e) {
      console.error('Excepción al consultar Supabase:', e);
      updateBadge('Sin Conexión', 'badge-warning', 'Trabajando en modo local');
      return null;
    }
  }

  async function saveRemoteState(stateObj, immediate = false) {
    if (!client && !initClient()) return;

    if (isSyncingFromRemote) {
      // Evitar rebote en bucle si estamos aplicando un cambio que vino de la nube
      return;
    }

    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = null;
    }

    const executeSave = async () => {
      try {
        isSaving = true;
        updateBadge('Guardando...', 'badge-info', 'Subiendo cambios a la nube...');

        // Clonar estado limpio para guardar
        const payload = {
          isAdmin: false, // Por seguridad no guardar estado admin permanente en el registro compartido
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
          updateBadge('Error al Guardar', 'badge-danger', error.message);
        } else {
          lastSavedTimestamp = now;
          updateBadge('Nube Activa', 'badge-success', `Guardado en la nube a las ${new Date().toLocaleTimeString()}`);
        }
      } catch (err) {
        console.error('Excepción al guardar en Supabase:', err);
        updateBadge('Error de Red', 'badge-warning', 'Los datos se guardaron localmente');
      } finally {
        isSaving = false;
      }
    };

    if (immediate) {
      await executeSave();
    } else {
      saveDebounceTimer = setTimeout(executeSave, 1200);
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

            // Si nosotros acabamos de guardar este registro, ignoramos la notificación propia
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
              updateBadge('Nube Activa', 'badge-success', `Actualizado en vivo: ${new Date().toLocaleTimeString()}`);
            } finally {
              setTimeout(() => { isSyncingFromRemote = false; }, 300);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('📡 Conectado a Supabase Realtime para Moonshine');
          }
        });
    } catch (e) {
      console.warn('No se pudo suscribir a Supabase Realtime:', e);
    }
  }

  // API Pública del Módulo
  window.MoonshineSupabase = {
    getConfig,
    setConfig,
    clearConfig,
    isConfigured,
    initClient,
    testConnection,
    fetchRemoteState,
    saveRemoteState,
    subscribeRealtime,
    updateBadge
  };
})();
