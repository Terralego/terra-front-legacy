import mockReponse from './userrequestRoutingResponse.json';

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

const getRoutingCoordinates = coordinates => (coordinates.map(pointCoords =>
  ([pointCoords[0] + 0.0005, pointCoords[1] + 0.0005])));

const getMockResponseWithCallbackId = (id, coordinates) => ({
  ...mockReponse,
  request: {
    ...mockReponse.request,
    callbackid: id,
  },
  results: {
    ...mockReponse.results,
    features: [
      {
        ...mockReponse.results.features[0],
        id: guid(),
        geometry: {
          ...mockReponse.results.features[0].geometry,
          coordinates: getRoutingCoordinates(coordinates),
        },
      },
    ],
  },
});

export default getMockResponseWithCallbackId;
