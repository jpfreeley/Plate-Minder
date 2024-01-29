export const DATA_PATH = './data';
export const FFMPEG_PATH = '/usr/lib/jellyfin-ffmpeg/ffmpeg';
export const MIGRATIONS_PATH = './migrations';
export const DEFAULT_MQTT_BASE_TOPIC = 'plate-minder';
export const DEFAULT_HASS_DISCOVERY_ENABLE = false;
export const DEFAULT_HASS_DISCOVERY_PREFIX = 'homeassistant';
export const DEFAULT_IMAGE_RETAIN_DAYS = 30;
export const FILE_PLATE_RECORDER_CLEANUP_INTERVAL = 300000;
export const FILE_PLATE_RECORDER_LOG = `${DATA_PATH}/file_recorder_plate_log_do_not_modify`;
export const TOKEN_SOURCE = '{{SOURCE}}';
export const TOKEN_DATE = '{{DATE}}';
export const TOKEN_TIME = '{{TIME}}';
export const TOKEN_PLATE = '{{PLATE}}';
export const TOKEN_CONFIDENCE = '{{CONFIDENCE}}';
export const DEFAULT_REST_SERVER_PORT = 4000;
export const DEFAULT_REST_SERVER_ENABLE = true;
export const READABLE_RETRY_DELAY = 5;
export const DEFAULT_CONFIG = {
	sources: [],
	filters: [],
	openALPR: {
		url: 'http://open-alpr-http-wrapper:3000/detect'
	},
	recorders: [],
	restService: {
		enable: true,
		port: 4000
	}
};
