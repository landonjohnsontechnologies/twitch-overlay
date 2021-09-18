import React from "react";
import Layout from "../components/layout/Layout";
import styles from "../styles/Center.module.scss";

export default function Start() {
  return (
    <div className={styles.root}>
      <div className={styles.index}>
        <Layout />
      </div>
      <div className={styles.base}>
        <div className={styles.grid}>
          <h1 className={styles.title}>
            <div className={styles.heading}>
              <span>starting soon</span>
              <span className={styles.blueTeal}>starting soon</span>
              <span className={styles.purplePink}>starting soon</span>
              <span className={styles.redYellow}>starting soon</span>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
}
