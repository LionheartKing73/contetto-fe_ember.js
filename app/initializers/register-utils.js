import UnseenCount from 'contetto/utils/unseen-count';

export function initialize(application) {
  application.register('utils:unseen-count', UnseenCount);
}

export default {
  name: 'register-utils',
  initialize
};
