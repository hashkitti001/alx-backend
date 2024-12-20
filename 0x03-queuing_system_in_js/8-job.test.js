import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  const bigBrother = sinon.spy(console);
  const testQueue = createQueue({ name: 'push_notification_code_test' });

  before(() => {
    testQueue.testMode.enter(true);
  });

  after(() => {
    testQueue.testMode.clear();
    testQueue.testMode.exit();
  });

  afterEach(() => {
    bigBrother.log.resetHistory();
  });

  it('displays an error message if jobs is not an array', () => {
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, testQueue)
    ).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type', (done) => {
    expect(testQueue.testMode.jobs.length).to.equal(0);
    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];
    createPushNotificationsJobs(jobInfos, testQueue);
    expect(testQueue.testMode.jobs.length).to.equal(2);
    expect(testQueue.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    expect(testQueue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    testQueue.process('push_notification_code_3', () => {
      expect(
        bigBrother.log
          .calledWith('Notification job created:', testQueue.testMode.jobs[0].id)
      ).to.be.true;
      done();
    });
  });

  it('registers the progress event handler for a job', (done) => {
    testQueue.testMode.jobs[0].addListener('progress', () => {
      expect(
        bigBrother.log
          .calledWith('Notification job', testQueue.testMode.jobs[0].id, '25% complete')
      ).to.be.true;
      done();
    });
    testQueue.testMode.jobs[0].emit('progress', 25);
  });

  it('registers the failed event handler for a job', (done) => {
    testQueue.testMode.jobs[0].addListener('failed', () => {
      expect(
        bigBrother.log
          .calledWith('Notification job', testQueue.testMode.jobs[0].id, 'failed:', 'Failed to send')
      ).to.be.true;
      done();
    });
    testQueue.testMode.jobs[0].emit('failed', new Error('Failed to send'));
  });

  it('registers the complete event handler for a job', (done) => {
    testQueue.testMode.jobs[0].addListener('complete', () => {
      expect(
        bigBrother.log
          .calledWith('Notification job', testQueue.testMode.jobs[0].id, 'completed')
      ).to.be.true;
      done();
    });
    testQueue.testMode.jobs[0].emit('complete');
  });
});