import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CommonUserstate } from "tmi.js";
import { opts } from "../lib/data.js";
import styles from "../styles/Home.module.scss";

const tmi = require("tmi.js");

export default function Home() {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    const client = new tmi.client(opts);

    client.on("message", onMessageHandler);
    client.on("connected", onConnectedHandler);

    client.connect();

    function onMessageHandler(
      target: string,
      context: CommonUserstate,
      msg: string,
      self: any
    ) {
      if (self) {
        return;
      }
      const commandName = msg.trim();

      if (commandName === "!dice") {
        const num = rollDice();
        client.say(target, `${Math.floor(num)}`);
        console.log(`* Executed ${commandName} command`);
      } else {
        const username = context.username;

        console.log(`${username}: ${commandName}`);
      }
    }

    function rollDice() {
      const sides = 6;
      return Math.floor(Math.random() * sides) + 1;
    }

    function onConnectedHandler(addr: string, port: string) {
      console.log(`* Connected to ${addr}:${port}`);
    }

    function renderDateTime(now: number) {
      setDateTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      requestAnimationFrame(renderDateTime);
    }
    requestAnimationFrame(renderDateTime);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>ljtechdotca</title>
        <meta
          name="description"
          content="Twitch overlay created by ljtechdotca"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <footer className={styles.footer}>
        <div className={styles.flex}>
          <a className={styles.logo} href="https://ljtech.ca">
            <span className={styles.image}>
              <Image alt="logo" src="/ljtech.svg" height={24} width={24} />
            </span>
            ljtech.ca
          </a>
          <div>
            <div className={styles.time}>{dateTime.time}</div>
            <div className={styles.date}>{dateTime.date}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
