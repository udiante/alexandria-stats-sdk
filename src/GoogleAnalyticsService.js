// GoogleAnalyticsService.js

const axios = require('axios');

class GoogleAnalyticsService {
    constructor() {
        this.measurementId = '';
        this.apiSecret = '';
        this.httpClient = null;
    }

    isInitialized() {
        return this.measurementId && this.apiSecret;
    }
    /**
     * Inicializa el servicio de Google Analytics con el Measurement ID y API Secret.
     * @param {string} measurementId - El Measurement ID de la propiedad de GA4.
     * @param {string} apiSecret - El API Secret para autenticación.
     */
    init(measurementId, apiSecret) {
        this.measurementId = measurementId;
        this.apiSecret = apiSecret;

        // Configura el cliente Axios con el endpoint preconfigurado
        this.httpClient = axios.create({
            baseURL: `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Envía un evento a Google Analytics 4.
     * @param {string} eventName - El nombre del evento.
     * @param {string} userId - Un identificador único para el usuario.
     * @param {Object} userProperties - Propiedades del usuario, como locale y país.
     * @param {Object} eventParams - Parámetros adicionales para el evento.
     */
    async sendEvent(eventName, userId, userProperties, eventParams = {}) {
        const payload = {
            client_id: userId,
            events: [
                {
                    name: eventName,
                    params: {
                        engagement_time_msec: 100,
                        ...userProperties,  // Añade las propiedades del usuario al evento
                        ...eventParams     // Añade los parámetros del evento
                    }
                }
            ]
        };

        try {
            const response = await this.httpClient.post('', payload);
        } catch (error) {
            console.error('Error al enviar el evento a GA4:', error.message);
        }
    }
}

module.exports = new GoogleAnalyticsService();
