import asyncHandler from 'express-async-handler';
import Request from '../models/requestModel.js';
  
/**
 * @desc    Gets all requests in a certain state
 * @route   GET /requests/:restaurantId/requests
 * @access  Public
 * @param req.params.restaurantId - id of the restaurant
 * @param req.query.state - state of requests to return
 * @returns {List: [Request]}
 */
const getRequests = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { state } = req.query;

  const requests = await Request.find({ restaurant : restaurantId, state: state }).sort('time');

  if (requests) {
    res.status(200).json(requests);  
  } else {
    res.status(204).json(requests);
  }
})
  
/**
 * @desc    Change state of request from waiting to assisting
 * @route   PUT /tables/:restaurantId/:requestId/assisting
 * @access  Private
 * @param req.params.requestId - id of the request
 * @returns {Request}
 */
const setRequestAssisting = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  // search db for particular request with _id
  const request = await Request.findOne({_id: requestId})
  if (!request) {
    // can't find the request for assistance in the db, something went wrong
    res.status(404)
    throw new Error('Something went wrong, could not find the Request For Assistance')
  }

  if (request.state != 'waiting') {
    res.status(400);
    throw new Error('Request is not waiting');  
  }
  request.state = 'assisting'
  await request.save();
  res.status(200).json(request)
})
  
/**
 * @desc    Change state of request from assisting to complete
 * @route   PUT /tables/:restaurantId/:requestId/complete
 * @access  Private
 * @param req.params.requestId - id of the request
 * @returns {Request}
 */
const setRequestComplete = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  // search db for particular request with _id
  const request = await Request.findOne({_id: requestId})
  if (!request) {
    // can't find the request for assistance in the db, something went wrong
    res.status(404)
    throw new Error('Something went wrong, could not find the Request For Assistance')
  }

  if (request.state != 'assisting') {
    res.status(400);
    throw new Error('Request is not assisting');  
  }
  request.state = 'complete'
  await request.save();
  res.status(200).json(request)
})

export { getRequests, setRequestAssisting, setRequestComplete };
