const getMockResponseWithCallbackId = (routingResponse, id) => ({
  ...routingResponse,
  request: {
    ...routingResponse.request,
    callbackid: id,
  },
});

export default getMockResponseWithCallbackId;
