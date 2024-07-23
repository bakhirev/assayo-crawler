function getConfigAndTasks(files: string[]) {
  let config = null;
  let tasks: any[] = [];

  (files || [])
    .map((text: string) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    })
    .filter(json => json && typeof json === 'object')
    .forEach((json) => {
      if (Array.isArray(json)) {
        tasks = tasks.concat(json);
      } else if (json.code) {
        tasks.push(json);
      } else {
        config = json;
      }
    });

  return { config, tasks };
}

export async function getStringFromFileList(files: any) {
  const text: string[] = await Promise.all(
    files.map((file: any) => file.text()),
  );
  return text.filter(file => file);
}

export function getOnDrop(setLoading: Function, onChange: Function) {
  return async function dropFile(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = [...(event?.dataTransfer?.items || [])]
      .map((file: any) => file.kind === 'file' ? file?.getAsFile() : null)
      .filter(file => file);

    console.log(files);
    setLoading(false);
    if (!files.length) return;

    const text = await getStringFromFileList(files);

    const { config, tasks } = getConfigAndTasks(text);
    if (config) {
      onChange('config', config);
    }
    if (tasks.length) {
      onChange('tasks', tasks);
    }
  };
}

export function getShowDropZone(setLoading: Function) {
  return function showDropZone(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
  };
}
