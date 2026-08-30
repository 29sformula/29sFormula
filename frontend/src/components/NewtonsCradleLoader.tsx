import React from 'react';
import styles from './NewtonsCradleLoader.module.css';

export default function NewtonsCradleLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  const loader = (
    <div className={styles.newtonsCradle}>
      <div className={styles.newtonsCradleDot}></div>
      <div className={styles.newtonsCradleDot}></div>
      <div className={styles.newtonsCradleDot}></div>
      <div className={styles.newtonsCradleDot}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.loaderWrapper}>
        {loader}
      </div>
    );
  }

  return loader;
}
