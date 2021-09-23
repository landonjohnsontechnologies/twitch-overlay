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
  // const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const fetchFollowerData = async () => {
      const followers = await fetch(
        `https://api.twitch.tv/helix/users/follows?to_id=605732264`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
            "Client-Id": `${process.env.CLIENT}`,
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
      const displayName = context["display-name"];
      const channel = target.replace("#", "");
      const tags = context[channel];
      const message = msg.trim();
      const args = message.slice(1).split(" ");
      const command = args.shift()?.toLowerCase();
      const parameter = parseInt(args[0]);

      console.log({
        displayName: displayName,
        channel: channel,
        tags: tags,
        message: message,
        args: args,
        command: command,
      });

      if (self) return;

      function rollDice() {
        const max = args.length >= 1 ? parameter : 6;
        return Math.floor(Math.random() * max) + 1;
      }

      function startCountdown() {
        const milliseconds = parameter ? parameter * 60000 : 300000;
        const target = new Date(Date.now() + milliseconds).toLocaleTimeString();
        console.log(target);
        setCountdown(target);
        return target;
      }

      if (message.startsWith("!")) {
        // todo : fix duplicate commands between streamer and public
        // milestone : streamer only commands
        if (displayName === "ljtechdotca") {
          switch (command) {
            //todo : timer command
            case "timer":
              startCountdown();
              client.say(channel, `${startCountdown()}`);
            // case "dice":
            //   client.say(channel, `${rollDice()}`);
            //   break;
            // case "drop":
            //   client.say(channel, "!drop something parachute");
            default:
              console.log(command);
          }
        }
        // milestone : public commands
        //  else {
        //   switch (command) {
        //     case "dice":
        //       client.say(channel, `${rollDice()}`);
        //       break;
        //   }
        // }
      }

      // milestone : chat log
      const stringReplacements: Message[] = [];
      if (context.emotes) {
        Object.entries(context.emotes).forEach(([id, positions]) => {
          const position = positions[0];
          const [start, end] = position.split("-");
          const stringToReplace = message.substring(
            parseInt(start, 10),
            parseInt(end, 10) + 1
          );

          let imgSrc = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`;

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
  }, []);

  useEffect(() => {
    // milestone - render the date time
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
    <div className={styles.root}>
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
        {/* // todo: countdown timer */}
        {/* <div className={styles.countdown}>{countdown}</div> */}
        <footer className={styles.footer}>
          <div className={styles.content}>
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
    </div>
  );
}
