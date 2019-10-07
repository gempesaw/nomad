import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import notifyError from 'nomad-ui/utils/notify-error';

export default Route.extend({
  model({ path = '/' }) {
    const decodedPath = decodeURIComponent(path);
    const task = this.modelFor('allocations.allocation.task');

    const pathWithTaskName = `${task.name}${decodedPath.startsWith('/') ? '' : '/'}${decodedPath}`;

    if (!task.isRunning) {
      return {
        path: decodedPath,
        taskModel: task,
      };
    }

    return RSVP.all([task.stat(pathWithTaskName), task.get('allocation.node')])
      .then(([statJson]) => {
        if (statJson.IsDir) {
          return RSVP.hash({
            path: decodedPath,
            taskModel: task,
            directoryEntries: task.ls(pathWithTaskName).catch(notifyError(this)),
            isFile: false,
          });
        } else {
          return {
            path: decodedPath,
            taskModel: task,
            isFile: true,
            stat: statJson,
          };
        }
      })
      .catch(notifyError(this));
  },

  setupController(controller, { path, taskModel, directoryEntries, isFile, stat } = {}) {
    this._super(...arguments);
    controller.setProperties({ path, taskModel, directoryEntries, isFile, stat });
  },
});
