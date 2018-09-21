import React from 'react';

const REFS = new Map();

export function createRef (target) {
  const ref = React.createRef();
  REFS.set(target, ref);
  return ref;
}

export function getRef (target) {
  const ref = REFS.get(target);
  return ref && ref.current;
}
