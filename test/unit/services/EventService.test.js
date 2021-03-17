const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Event Service', function () {
  let client;

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('Event', function () {
    it('should create new event', function () {
      const thingId = 'MyThing';
      const eventPayload = { _status: 'Open', _code: 'T1', _thingId: thingId };
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events`,
          method: 'POST',
          body: eventPayload,
        });
      };

      return client.createEvent(eventPayload);
    });

    it('should read single event', function () {
      const eventId = 'MyEvent';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events('${eventId}')`,
        });
      };

      return client.getEvent(eventId);
    });

    it('should read multiple events', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events`,
        });
      };

      return client.getEvents();
    });

    it('should read multiple events with different query parameters', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events?$select=_thingId,_status&$orderby=_thingId&$top=10&$skip=5`,
        });
      };

      return client.getEvents({
        $select: '_thingId,_status', $orderby: '_thingId', $top: 10, $skip: 5,
      });
    });

    it('should read multiple events by thing identifier', function () {
      const thingId = 'MyThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events?$filter=_thingId eq '${thingId}'`,
        });
      };

      return client.getEventsByThingId(thingId);
    });

    it('should read multiple events by thing type with complex filter', function () {
      const thingId = 'MyThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events?$filter=_status eq 'Completed' and _thingId eq '${thingId}'`,
        });
      };

      return client.getEventsByThingId(thingId, { $filter: '_status eq \'Completed\'' });
    });

    it('should delete event', function () {
      const eventId = 'MyEvent';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Events('${eventId}')`,
          method: 'DELETE',
        });
      };

      return client.deleteEvent(eventId);
    });
  });
});
