export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout'
  },
  CANDIDATES: {
    LIST: '/candidates',
    CREATE: '/candidates',
    GET: (id) => `/candidates/${id}`,
    UPDATE: (id) => `/candidates/${id}`,
    DELETE: (id) => `/candidates/${id}`
  },
  MESSAGES: {
    GET: (candidateId) => `/messages/${candidateId}`,
    CREATE: '/messages'
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`
  },
  USERS: {
    SEARCH: '/users/search',
    LIST: '/users'
  }
};

export const SOCKET_EVENTS = {
  CLIENT_TO_SERVER: {
    JOIN_ROOM: 'join_candidate_room',
    LEAVE_ROOM: 'leave_candidate_room',
    SEND_MESSAGE: 'send_message',
    TYPING: 'typing'
  },
  SERVER_TO_CLIENT: {
    MESSAGE_RECEIVED: 'message_received',
    USER_TAGGED: 'user_tagged',
    USER_TYPING: 'user_typing',
    NOTIFICATION_UPDATE: 'notification_count_updated',
    MESSAGE_SENT: 'message_sent',
    ERROR: 'error'
  }
};

export const MESSAGE_CONSTRAINTS = {
  MAX_LENGTH: 2000,
  MIN_LENGTH: 1
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MESSAGES_PAGE_SIZE: 50
};