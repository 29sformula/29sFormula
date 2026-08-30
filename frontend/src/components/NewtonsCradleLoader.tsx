'use client';

import React from 'react';
import styles from './NewtonsCradleLoader.module.css';

export default function NewtonsCradleLoader() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.newtonsCradle}>
        <div className={styles.newtonsCradleDot}></div>
        <div className={styles.newtonsCradleDot}></div>
        <div className={styles.newtonsCradleDot}></div>
        <div className={styles.newtonsCradleDot}></div>
      </div>
    </div>
  );
}
