import { default as _ } from 'lodash';
window._ = _;

import axios from 'axios';
window.axios = axios;

window.axios.defaults.baseURL = `${import.meta.env.VITE_APP_URL}`
window.axios.defaults.withCredentials = true
window.axios.defaults.withXSRFToken = true
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import 'bootstrap';

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

} catch (e) {}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import StorageService from './services/storage.service';

window.YoureduStorage = new StorageService('localStorage')
