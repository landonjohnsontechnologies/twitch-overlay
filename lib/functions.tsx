// todo: old commands
// interface Commands {
//   message: string[];
//   function: Record<string, () => any>;
// }
// const commands: Commands = {
//   message: ["!dice", "!drop", "!timer", "!clear", "!hello"],
//   function: {
//     dice: () => {
//       const sides = 6;
//       return Math.floor(Math.random() * sides) + 1;
//     },
//     drop: () => {
//       return "!drop something parachute";
//     },
//     timer: (minutes: number = 5, seconds: number = 0) => {
//       const target = new Date(
//         Date.now() + (minutes * 60 + seconds) * 1000
//       );
//       let lastTS = 0;

//       const repeatable = () => {
//         console.log({ frame: frame });
//         const newTS = Date.now();
//         const totalMS = target.getTime() - newTS;
//         const totalSS = totalMS / 1000;
//         const totalMM = totalSS / 60;
//         if (totalMS > 0) {
//           if (Math.floor(newTS / 1000) > Math.floor(lastTS / 1000)) {
//             lastTS = newTS;
//             setCountdown(
//               `${Math.floor(totalMM % 60)}:${Math.floor(
//                 totalSS % 60
//               ).toLocaleString("en-US", {
//                 minimumIntegerDigits: 2,
//                 useGrouping: false,
//               })}`
//             );
//           }

//           setFrame(requestAnimationFrame(repeatable));
//         }
//       };
//       setFrame(requestAnimationFrame(repeatable));
//       return "Be back in 5 minutes!";
//     },
//     clear: function clearTimer() {
//       setFrame(0);
//       setCountdown(undefined);
//       return "Timer cleared!";
//     },
//   },
// };
