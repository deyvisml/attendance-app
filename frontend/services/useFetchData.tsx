// import { store } from '/src/store/store';
// const urlBackend = import.meta.env.VITE_URL_BACKEND;
import { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';

const useFetchData = () => {
  // const accessToken = useSelector( state => state.user.accessToken);
  const accessToken = "";
  // const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb3JlYmFua2lhIiwiaWF0IjoxNzM3Mzk2OTcyLCJleHAiOjE3Mzc0ODMzNzJ9.I9dvulNOvCQHVjGS8pJ2nYc6s-wgKyDDjQIUsxYc3wM';

  const controllerRef  = useRef(null);
  const requestIdRef = useRef(0);
  const isThereAnErrordRef = useRef(false)
  const abortOnDismount = useRef(true)
  const get = async (params = {}) => {
    params.startLoading?.();
    // Incrementar el ID de la petición
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    // Abortar la petición anterior si existe
    if(controllerRef.current){controllerRef.current.abort()}

    // Crear un nuevo AbortController para la petición actual
    controllerRef.current = new AbortController();

    // Limpia bool que informa sobre si se genera un error
    isThereAnErrordRef.current = false;

    // Construir la URL
    const url = `${urlBackend}${params.path}`;
    // Insertar el token por defecto y quitarlo si se asigna falso a params.token
    if (params.token === false) { delete params.token } else { params.token = true }
    // Verificar condicion que aborta peticion cuando el componente se desmuenta
    if (params.abort === false) { abortOnDismount.current = false } else { abortOnDismount.current = true}

    // Configurar las opciones de la petición
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(params.token && {'Authorization': `Bearer ${accessToken}`})
        // 'Authorization': `Bearer ${accessToken}`
      },
      signal: controllerRef.current.signal,
      // Normalmente no se incluye body en GET, pero si fuera necesario:
      ...(params.body && { body: JSON.stringify(params.body) })
    };

    let parsedValue = null;
    try {
      const promiseResolved = await fetch(url, options);
      if (promiseResolved.headers.get('content-type')?.includes('application/json')) {
        parsedValue = await promiseResolved.json();
      }
      if (!promiseResolved.ok) {
        const error = new Error("Ocurrió un error");
        error.details = {
          parsedValue,
          promiseResolved
        };
        throw error;
      }
      return params.adapterSuccessfulResponse(parsedValue, params.rulesSuccessfulResponse);
    } catch (error) {
      if (currentRequestId === requestIdRef.current) isThereAnErrordRef.current = true;
      return params.adapterErrorResponse(error, params.rulesErrorResponse);
    } finally {
      if (currentRequestId === requestIdRef.current) { params.finishLoading?.(isThereAnErrordRef.current)}
    }
  }

  const post = async (params = {}) => {
      params.startLoading?.();
      // Incrementar el ID de la petición
      requestIdRef.current += 1;
      const currentRequestId = requestIdRef.current;
      // Abortar la petición anterior si existe
      if(controllerRef.current){controllerRef.current.abort()}
      // Crear un nuevo AbortController para la petición actual
      controllerRef.current = new AbortController();

      // Limpia bool que informa sobre si se genera un error
      isThereAnErrordRef.current = false;

    // Construir la URL
    const url = `${urlBackend}${params.path}`;
    // Insertar el token por defecto y quitar token si se asigna falso a params.token
    if (params.token === false) { delete params.token } else { params.token = true }
    // Verificar condicion que aborta peticion cuando el componente se desmuenta
    if (params.abort === false) { abortOnDismount.current = false } else { abortOnDismount.current = true}
    // Configurar las opciones de la petición para POST
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(params.token && {'Authorization': `Bearer ${accessToken}`})
        // 'Authorization': `Bearer ${accessToken}`
      },
      signal: controllerRef.current.signal,
      // En POST se suele enviar un body
      ...(params.body && { body: JSON.stringify(params.body) })
    };

    let parsedValue = null;
    try {
      const promiseResolved = await fetch(url, options);
      if (promiseResolved.headers.get('content-type')?.includes('application/json')) {
        parsedValue = await promiseResolved.json();
      }
      if (!promiseResolved.ok) {
        const error = new Error("Ocurrió un error");
        error.details = {
          parsedValue,
          promiseResolved
        };
        throw error;
      }
      return params.adapterSuccessfulResponse(parsedValue, params.rulesSuccessfulResponse);
    } catch (error) {
      if (currentRequestId === requestIdRef.current) isThereAnErrordRef.current = true;
      return params.adapterErrorResponse(error, params.rulesErrorResponse);
    } finally {
      if (currentRequestId === requestIdRef.current) { params.finishLoading?.(isThereAnErrordRef.current)}
    }
  }

  const put = async (params = {}) => {
    params.startLoading?.();
    // Incrementar el ID de la petición
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    // Abortar la petición anterior si existe
    if(controllerRef.current){controllerRef.current.abort()}

    // Crear un nuevo AbortController para la petición actual
    controllerRef.current = new AbortController();

    // Limpia bool que informa sobre si se genera un error
    isThereAnErrordRef.current = false;

    // Construir la URL
    const url = `${urlBackend}${params.path}`;
    // Insertar el token por defecto y quitar token si se asigna falso a params.token
    if (params.token === false) { delete params.token } else { params.token = true }
    // Verificar condicion que aborta peticion cuando el componente se desmuenta
    if (params.abort === false) { abortOnDismount.current = false } else { abortOnDismount.current = true}
    // Configurar las opciones de la petición para POST
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(params.token && {'Authorization': `Bearer ${accessToken}`})
        // 'Authorization': `Bearer ${accessToken}`
      },
      signal: controllerRef.current.signal,
      // En POST se suele enviar un body
      ...(params.body && { body: JSON.stringify(params.body) })
    };

    let parsedValue = null;
    try {
      const promiseResolved = await fetch(url, options);
      if (promiseResolved.headers.get('content-type')?.includes('application/json')) {
        parsedValue = await promiseResolved.json();
      }
      if (!promiseResolved.ok) {
        const error = new Error("Ocurrió un error");
        error.details = {
          parsedValue,
          promiseResolved
        };
        throw error;
      }
      return params.adapterSuccessfulResponse(parsedValue, params.rulesSuccessfulResponse);
    } catch (error) {
      if (currentRequestId === requestIdRef.current) isThereAnErrordRef.current = true;
      return params.adapterErrorResponse(error, params.rulesErrorResponse);
    } finally {
      if (currentRequestId === requestIdRef.current) { params.finishLoading?.(isThereAnErrordRef.current)}
    }
  }

  const remove = async (params = {}) => {
    params.startLoading?.();
    // Incrementar el ID de la petición
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    // Abortar la petición anterior si existe
    if(controllerRef.current){controllerRef.current.abort()}

    // Crear un nuevo AbortController para la petición actual
    controllerRef.current = new AbortController();

    // Limpia bool que informa sobre si se genera un error
    isThereAnErrordRef.current = false;

    // Construir la URL
    const url = `${urlBackend}${params.path}`;
    // Insertar el token por defecto y quitar token si se asigna falso a params.token
    if (params.token === false) { delete params.token } else { params.token = true }
    // Verificar condicion que aborta peticion cuando el componente se desmuenta
    if (params.abort === false) { abortOnDismount.current = false } else { abortOnDismount.current = true}
    // Configurar las opciones de la petición para POST
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(params.token && {'Authorization': `Bearer ${accessToken}`})
        // 'Authorization': `Bearer ${accessToken}`
      },
      signal: controllerRef.current.signal,
      // En POST se suele enviar un body
      ...(params.body && { body: JSON.stringify(params.body) })
    };

    let parsedValue = null;
    try {
      const promiseResolved = await fetch(url, options);
      if (promiseResolved.headers.get('content-type')?.includes('application/json')) {
        parsedValue = await promiseResolved.json();
      }
      if (!promiseResolved.ok) {
        const error = new Error("Ocurrió un error");
        error.details = {
          parsedValue,
          promiseResolved
        };
        throw error;
      }
      return params.adapterSuccessfulResponse(parsedValue, params.rulesSuccessfulResponse);
    } catch (error) {
      if (currentRequestId === requestIdRef.current) isThereAnErrordRef.current = true;
      return params.adapterErrorResponse(error, params.rulesErrorResponse);
    } finally {
      if (currentRequestId === requestIdRef.current) { params.finishLoading?.(isThereAnErrordRef.current)}
    }
  }

  
  const abortRequest = () => {
    isThereAnErrordRef.current = true; 
    controllerRef.current?.abort();
    controllerRef.current = null;
  }

  useEffect(()=>{
    return () => {
        if(abortOnDismount.current){
          controllerRef?.current?.abort()
        }
      }
  },[])

  return {
    get: get,
    post: post,
    put: put,
    remove: remove,
    abortRequest:abortRequest,
  }

}

export default useFetchData;