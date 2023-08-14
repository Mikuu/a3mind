export const getDefaultNodeStyle = () => {
  return {
    color: '#777777',
    background: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'font-weight-regular'
  }
}
export const updateClassName = (currentClasses, classNames, className) => {
  const classList = currentClasses.split(' ');

  if (classList.includes(className)) {
    classList.splice(classList.indexOf(className), 1);
  }

  classNames.forEach(cls => {
    if (classList.includes(cls)) {
      classList.splice(classList.indexOf(cls), 1);
    }
  });

  classList.push(className);
  const updatedClassName = classList.join(' ');
  return updatedClassName;
}

export const removeClass = (currentClasses, classToRemove) => {
  const classList = currentClasses.split(' ');

  if (classList.includes(classToRemove)) {
    classList.splice(classList.indexOf(classToRemove), 1);
  }

  const updatedClassName = classList.join(' ');
  return updatedClassName;
}

export const appendClass = (currentClasses, classToAppend) => {
  const classList = currentClasses.split(' ');

  if (!classList.includes(classToAppend)) {
    classList.push(classToAppend);
  }

  const updatedClassName = classList.join(' ');
  return updatedClassName;
}

export const appendClasses = (currentClasses, classesToAppend) => {
  const classList = currentClasses.split(' ');
  const classListToAppend = classesToAppend.split(' ');

  classListToAppend.forEach(cls => {
    if (!classList.includes(cls)) {
      classList.push(cls);
    }
  });

  const updatedClassName = classList.join(' ');
  return updatedClassName;
}
