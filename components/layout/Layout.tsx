import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CommonUserstate } from "tmi.js";
import { opts } from "../../lib/data.js";
import styles from "./Layout.module.scss";

const tmi = require("tmi.js");

interface Message {
  text: string;
  src: string;
  img: HTMLImageElement;
}

export default function Layout() {
  const chatRef = useRef<HTMLUListElement>(null);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [followers, setFollowers] = useState<number>(0);
  const [countdown, setCountdown] = useState<string>();

  // todo: bearer token is public lol woopsie
  useEffect(() => {
    const fetchFollowerData = async () => {
      const followers = await fetch(
        `https://api.twitch.tv/helix/users/follows?to_id=605732264`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer 09qsq8nliw5kq12eneni72vicahtlg",
            "Client-Id": "sxj0zfm4ts94sit4qp9380grqcqrwt",
          },
        }
      );
      const followersData = await followers.json();
      setFollowers(followersData.total);
    };

    fetchFollowerData();

    const client = new tmi.client(opts);
    client.connect();

    client.on("connected", onConnectedHandler);
    function onConnectedHandler(addr: string, port: string) {
      console.log(`* Connected to ${addr}:${port}`);
    }

    client.on("message", onMessageHandler);
    function onMessageHandler(
      target: string,
      context: CommonUserstate,
      msg: string,
      self: boolean
    ) {
      if (self || !msg.startsWith("!")) return;

      const displayName = context["display-name"];
      const message = msg.trim();

      interface Commands {
        message: string[];
        function: Record<string, () => any>;
      }
      //todo: fix the countdown from overlapping
      const commands: Commands = {
        message: ["!dice", "!drop", "!timer"],
        function: {
          dice: function rollDice() {
            const sides = 6;
            return Math.floor(Math.random() * sides) + 1;
          },
          drop: function dropDude() {
            return "!drop something parachute";
          },
          timer: function startCountdown(
            minutes: number = 5,
            seconds: number = 0
          ) {
            const target = new Date(
              Date.now() + (minutes * 60 + seconds) * 1000
            );
            let lastTS = 0;

            const repeatable = () => {
              const newTS = Date.now();
              const totalMS = target.getTime() - newTS;
              const totalSS = totalMS / 1000;
              const totalMM = totalSS / 60;
              if (totalMS > 0) {
                if (Math.floor(newTS / 1000) > Math.floor(lastTS / 1000)) {
                  lastTS = newTS;
                  setCountdown(
                    `${Math.floor(totalMM % 60)}:${Math.floor(totalSS % 60)}`
                  );
                  // console.log(
                  //   `Time remaining:${Math.floor(totalMM % 60)}:${Math.floor(
                  //     totalSS % 60
                  //   )}`
                  // );
                }
                requestAnimationFrame(repeatable);
              }
            };
            requestAnimationFrame(repeatable);
            return "Be back in 5 minutes!";
          },
        },
      };

      // check for commands and streamer username
      if (
        commands.message.some((string) => message === string) &&
        context.username === "ljtechdotca"
      ) {
        console.log(`* Executed ${message} command`);
        const commandMessage = message.replace("!", "");

        const commandFunction = commands.function[commandMessage];

        if (typeof commandFunction() === "number") {
          client.say(target, `${Math.floor(commandFunction())}`);
        } else {
          client.say(target, commandFunction());
        }
      } else {
        const stringReplacements: Message[] = [];
        if (context.emotes) {
          Object.entries(context.emotes).forEach(([id, positions]) => {
            const position = positions[0];
            const [start, end] = position.split("-");
            const stringToReplace = message.substring(
              parseInt(start, 10),
              parseInt(end, 10) + 1
            );

            let imgSrc = `https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`;

            let imgElement = document.createElement("img");
            imgElement.classList.add("emoji");
            imgElement.src = imgSrc;
            imgElement.alt = stringToReplace;
            imgElement.width = 28;
            imgElement.height = 28;

            stringReplacements.push({
              text: stringToReplace,
              src: imgSrc,
              img: imgElement,
            });
          });
        }

        let splitArray: Array<any> = message.split(" ");

        for (let i = 0; i < splitArray.length; i++) {
          if (
            stringReplacements.some(
              (messageObject) => messageObject.text === splitArray[i]
            )
          ) {
            splitArray[i] = stringReplacements.find(
              (stringReplacement) => stringReplacement.text === splitArray[i]
            )?.img as HTMLImageElement;
          } else if (i !== splitArray.length - 1) {
            splitArray[i] = document.createTextNode(
              (splitArray[i] as string) + " "
            );
          } else {
            splitArray[i] = document.createTextNode(splitArray[i] as string);
          }
        }

        let messageArray: Array<any> = splitArray;
        let chat = chatRef.current as HTMLUListElement;
        let chatItem = document.createElement("li");
        let chatUser = document.createElement("span");
        let chatContent = document.createElement("span");

        messageArray.forEach((word) => chatContent.appendChild(word));
        chatItem.classList.add("message");

        chatUser.appendChild(document.createTextNode(displayName + ": "));
        chatUser.classList.add("name");
        if (context.color) {
          chatUser.style.color = context.color as string;
        } else {
          chatUser.classList.add("rainbow");
        }

        chatContent.classList.add("content");

        chatItem.appendChild(chatUser);
        chatItem.appendChild(chatContent);
        chat.appendChild(chatItem);
        if (chat.childNodes.length > 10) {
          chat.childNodes[0].remove();
        }
        chatItem.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }

    // render the date time
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
    <>
      <Head>
        <title>ljtechdotca</title>
        <meta
          name="description"
          content="Twitch overlay created by ljtechdotca"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <ul className={styles.chat} ref={chatRef}></ul>
        <div className={styles.countdown}>{countdown}</div>
        <footer className={styles.footer}>
          <div className={styles.root}>
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
            <div className={styles.end}>
              <div>follower goal:</div>
              <div className={styles.progress}>
                <div
                  className={styles.filled}
                  style={{
                    width: `${followers / Math.ceil(followers / 100)}%`,
                  }}
                >
                  {followers}
                </div>
                <div className={styles.empty}></div>
              </div>
              <div>{Math.ceil(followers / 100) * 100}</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
