function createRequestDto(body) {
  return {
    user: body.user,
    dateTime: body.dateTime,
    accessType: body.accessType,
    comment: body.comment,
    status: body.status
  };
}

function updateRequestDto(body) {
  return {
    user: body.user,
    comment: body.comment,
    status: body.status
  };
}

function requestResponseDto(data) {
  return {
    id: data.id,
    user: data.user,
    status: data.status
  };
}

module.exports = {
  createRequestDto,
  updateRequestDto,
  requestResponseDto
};