const logError = (name, action, info) => {
  if (!info) {
    info = 'empty'
  }
  try {
    // var device = JSON.stringify(deviceInfo);
  } catch (e) {
    console.error('not support getSystemInfoSync api', e.message)
  }
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }

}

export default logError;
