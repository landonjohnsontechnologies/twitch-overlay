import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const colors = ["blue", "green", "pink", "purple"];
  const [randomNum, setRandomNum] = useState(0);
  const [counting, setCounting] = useState(false);
  const [counter, setCounter] = useState<any>(null);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  const startCounter = () => {
    const newCounter = setInterval(() => {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      setDateTime({ date: date, time: time });
    }, 1000);
    setCounter(newCounter);
  };

  useEffect(() => {
    const newRandomNum = Math.floor(Math.random() * (3 - 0 + 1) + 0);
    setRandomNum(newRandomNum);

    if (!counting && counter == null) {
      setCounting(true);
      startCounter();
    } else {
      clearInterval(counter);
    }
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
      <footer
        className={
          styles[
            randomNum == 0
              ? "footer__blue"
              : randomNum == 1
              ? "footer__green"
              : randomNum == 2
              ? "footer__pink"
              : randomNum == 3
              ? "footer__purple"
              : "footer__blue"
          ]
        }
      >
        {/* logo */}
        <div className={styles.flex}>
          <a className={styles.logo} href="https://ljtech.ca">
            <Image
              alt="logo"
              src={`/logo-${colors[randomNum]}.svg`}
              height={24}
              width={24}
            />
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
