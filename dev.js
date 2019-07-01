import watch from 'node-watch';
import cluster from 'cluster';

const TASK_WATCH_FILES = 'watch_files';

let watchingCluster;
if (cluster.isMaster) {
  if (!watchingCluster) {
    watchingCluster = cluster.fork({ TASK: TASK_WATCH_FILES });

    watchingCluster.on('file', (event, path) => {
      console.log(event, path);
    })
  }
} else {
  ({
    [TASK_WATCH_FILES]: watchFiles
  }[process.env.TASK] || errorAndDie)();
}

function errorAndDie () {
  console.error('Undefined Task');
}

function watchFiles () {
  console.log('watching files');
  watch('./src', { recursive: true, filter: /\.test.js$/ }, function (evt, name) {
    cluster.send(evt, name);
  });
}
