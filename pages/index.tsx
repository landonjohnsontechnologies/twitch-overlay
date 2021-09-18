import React from "react";
import Layout from "../components/layout/Layout";
import styles from "../styles/Center.module.scss";

export default function Home() {
  return (
    <div className={styles.root}>
      <div className={styles.index}>
        <Layout />
      </div>
    </div>
  );
}
