const connector = new CloseIOConnector();

// Top level function called by Google Data Studio
function getAuthType() {
  return connector.authType;
}

// Top level function called by Google Data Studio
function getConfig() {
  return {
    configParams: connector.configParams
  };
}

// Top level function called by Google Data Studio
function getSchema() {
  return {
    schema: connector.schema
  }
}

function getData(request) {
  console.log("request")  ;
  console.log(request);
  try {
    connector.getData(request);

  } catch(e) {
    console.log(e);
  }
}