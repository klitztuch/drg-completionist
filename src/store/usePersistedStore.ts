import { useState } from 'react';
import {
  PropSchema,
  createSimpleSchema,
  custom,
  deserialize,
  serialize,
  map as serializrMap,
} from 'serializr';
import { INITIAL_STATE, State } from './state';

const STORAGE_KEY = 'data';

/**
 * Sets are serialized as an array, and deserialized back from the array
 */
function set(): PropSchema {
  return custom(
    (v) => Array.from(v),
    (v) => new Set(v)
  );
}

/**
 * Serializr converts javascript maps to objects for serializtion but does
 * not do the inverse transform. This is a thin wrapper around their serializer
 * that does that.
 */
function map(valueSerializer: PropSchema) {
  return serializrMap(valueSerializer, {
    beforeDeserialize: (callback, v) => {
      if (v === undefined) {
        callback(null, {});
      } else {
        callback(null, v);
      }
    },
    afterDeserialize: (callback, _, n) => {
      callback(null, new Map(Object.entries(n)));
    },
  });
}

export const schema = createSimpleSchema<State>({
  overclocks: map(set()),
  frameworks: map(set()),
  unforgedOverclocks: map(set()),
});

export default function usePersistedStore(): [State, (value: State) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? deserialize(schema, JSON.parse(item)) : INITIAL_STATE;
    } catch (error) {
      console.log(error);
      return INITIAL_STATE;
    }
  });

  const setValue = (value: State) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(serialize(schema, value))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}