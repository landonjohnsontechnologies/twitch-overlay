import React from "react";
import Layout from "../components/layout/Layout";
import styles from "../styles/Center.module.scss";

export default function Afk() {
  return (
    <div className={styles.root}>
      <div className={styles.base}>
        <div className={styles.grid}>
          <h1 className={styles.title}>
            <div className={styles.heading}>
              <span>brb</span>
              <span className={styles.blueTeal}>brb</span>
              <span className={styles.purplePink}>brb</span>
              <span className={styles.redYellow}>brb</span>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
}
