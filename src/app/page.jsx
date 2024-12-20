"use client";
import Image from "next/image";
import styles from "./home.module.css";
import "./globals.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ClientWrapper from "@/utils/clientWrapper";
import { useGlobal } from "@/utils/global";
import axios from "axios";
import { DateTime } from "luxon";
import { Html5Qrcode } from "html5-qrcode";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Подключаем плагин Filler для заливки
);

export default function Home() {
  const { user, auth, logout } = useGlobal();
  const [camerabutton, setcamerabutton] = useState(false);
  const [boxleft, setboxleft] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [opensort, setopensort] = useState(false);
  const [sort1, setsort1] = useState(true);
  const [sort2, setsort2] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [btnmain, setbtnmain] = useState(true);
  const [btnreport, setbtnreport] = useState(false);
  const [btncontrol, setbtncontrol] = useState(false);
  const [btnsettings, setbtnsettings] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "По цене",
        data: [],
        borderColor: "#BA8AFF",
        backgroundColor: "rgba(171, 112, 255, 0.3)", // Полупрозрачный цвет заливки
        fill: "origin",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  });

  const [chartData2, setChartData2] = useState({
    labels: [],
    datasets: [
      {
        label: "По количеству продаж",
        data: [],
        borderColor: "#D2F902",
        backgroundColor: "rgba(210, 249, 2, 0.3)", // Полупрозрачный цвет заливки
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.tcats.uz/api/crm/admin/stats/"
        );
        const apiData = response.data.data;

        const labels = apiData.map((item) => item.date);
        const amounts = apiData.map((item) => item.amount);
        const counts = apiData.map((item) => item.count);

        setChartData((prevData) => ({
          ...prevData,
          labels,
          datasets: [{ ...prevData.datasets[0], data: amounts }],
        }));
        setChartData2((prevData) => ({
          ...prevData,
          labels,
          datasets: [{ ...prevData.datasets[0], data: counts }],
        }));
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      filler: {
        propagate: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        backgroundColor: "#B36DFF",
        borderColor: "#B36DFF",
      },
    },
    interaction: {
      intersect: false,
    },
    tension: 0.4,
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      filler: {
        propagate: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        backgroundColor: "#8BA501",
        borderColor: "#D2F902",
      },
    },
    interaction: {
      intersect: false,
    },
    tension: 0.4,
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const clickcamerabutton = () => {
    setcamerabutton(!camerabutton);
  };

  const clickboxleftbutton = () => {
    setboxleft(!boxleft);
  };

  const clickopensort = () => {
    setopensort(!opensort);
  };
  const clicksort1 = () => {
    if (!sort1) {
      // Проверяем, неактивна ли кнопка
      setsort1(true); // Активируем первую кнопку
      setsort2(false); // Деактивируем вторую кнопку
    }
  };

  const clicksort2 = () => {
    if (!sort2) {
      // Проверяем, неактивна ли кнопка
      setsort2(true); // Активируем вторую кнопку
      setsort1(false); // Деактивируем первую кнопку
    }
  };

  // Обновление времени каждую секунду

  useEffect(() => {
    const interval = setInterval(() => {
      const uzbTime = DateTime.now()
        .setZone("Asia/Tashkent")
        .toLocaleString(DateTime.TIME_24_WITH_SECONDS);
      setTime(uzbTime); // Установка текущего времени
    }, 1000);

    return () => clearInterval(interval); // Очистка интервала
  }, []);

  useEffect(() => {
    // Установка текущей даты в формате День.Месяц.Год
    const uzbDate = DateTime.now()
      .setZone("Asia/Tashkent")
      .toLocaleString(DateTime.DATE_FULL); // Формат: "12 декабря 2024 г."
    setDate(uzbDate);
  }, []);

  const clickbtnmain = () => {
    if (!btnmain) {
      setbtnmain(true);
      setbtnreport(false);
      setbtncontrol(false);
      setbtnsettings(false);
    }
  };

  const clickbtnreport = () => {
    if (!btnreport) {
      setbtnmain(false);
      setbtnreport(true);
      setbtncontrol(false);
      setbtnsettings(false);
    }
  };
  const clickbtncontrol = () => {
    if (!btncontrol) {
      setbtnmain(false);
      setbtnreport(false);
      setbtncontrol(true);
      setbtnsettings(false);
    }
  };
  const clickbtnsettings = () => {
    if (!btnsettings) {
      setbtnmain(false);
      setbtnreport(false);
      setbtncontrol(false);
      setbtnsettings(true);
    }
  };

  // -------------------------------------------------------------------------
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrMessage, setQrMessage] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Получение списка камер при загрузке компонента
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id); // Установить первую камеру по умолчанию
        } else {
          setError("Камеры не найдены");
        }
      })
      .catch((err) => {
        console.error("Ошибка получения списка камер:", err);
        setError("Не удалось получить доступ к камерам");
      });
  }, []);

  useEffect(() => {
    let html5QrCode;

    const qrCodeSuccess = (decodedText) => {
      console.log("QR-код успешно считан:", decodedText);
      setQrMessage(decodedText);
      setIsEnabled(false);
    };

    const qrCodeError = (error) => {
      console.warn("Ошибка считывания QR-кода:", error);
    };

    if (isEnabled && selectedCamera) {
      html5QrCode = new Html5Qrcode("qrCodeContainer");
      html5QrCode
        .start(
          selectedCamera,
          { fps: 15, qrbox: { width: 400, height: 400 } },
          qrCodeSuccess,
          qrCodeError
        )
        .catch((err) => {
          console.error("Ошибка запуска сканера:", err);
        });
    }

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode.clear());
      }
    };
  }, [isEnabled, selectedCamera]);

  // --------------------------------------------
  // MUIZ НЕ ТРОГАЙ ЭТОТ КОД !!!

  // const [isEnabled, setIsEnabled] = useState(false);
  // const [qrMessage, setQrMessage] = useState("");
  // const [isPosting, setIsPosting] = useState(false); // Для индикации отправки

  // useEffect(() => {
  //   let html5QrCode;

  //   const qrCodeSuccess = async (decodedText) => {
  //     console.log("QR-код успешно считан:", decodedText);
  //     setQrMessage(decodedText);
  //     setIsEnabled(false);

  //     // Отправка данных на API
  //     try {
  //       setIsPosting(true);
  //       const response = await fetch("https://api.tcats.uz/api/crm/cashier/scanner/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NjQzNzEyLCJpYXQiOjE3MzQ2NDE5MTIsImp0aSI6IjUyOWQwZDliNmM1NTRhZWI4YWUyYTgyYmY5ZGY2M2E1IiwidXNlcl9pZCI6MTIxOH0.pzXm2a3OVubwZx6VseT7MOS8HsJ7ZTyk71ZcA6ZgpsA`, // Добавьте токен сюда
  //         },
  //         body: JSON.stringify({
  //           ticket_id: decodedText,
  //         }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Ответ API:", data);
  //         alert("QR-код успешно отправлен!");
  //       } else {
  //         console.error("Ошибка API:", response.statusText);
  //         alert("Ошибка при отправке QR-кода.");
  //       }
  //     } catch (error) {
  //       console.error("Ошибка сети:", error);
  //       alert("Ошибка сети при отправке QR-кода.");
  //     } finally {
  //       setIsPosting(false);
  //     }
  //   };

  //   const qrCodeError = (error) => {
  //     console.warn("Ошибка считывания QR-кода:", error);
  //   };

  //   if (isEnabled) {
  //     html5QrCode = new Html5Qrcode("qrCodeContainer");
  //     html5QrCode
  //       .start(
  //         { facingMode: "environment" },
  //         { fps: 15, qrbox: { width: 400, height: 400 } },
  //         qrCodeSuccess,
  //         qrCodeError
  //       )
  //       .catch((err) => {
  //         console.error("Ошибка запуска сканера:", err);
  //       });
  //   }

  //   return () => {
  //     if (html5QrCode) {
  //       html5QrCode.stop().then(() => html5QrCode.clear());
  //     }
  //   };
  // }, [isEnabled]);

  return (
    <ClientWrapper>
      {isEnabled ? (
        <div className={styles.blockforScanner}>
          <button onClick={() => setIsEnabled(!isEnabled)}></button>
          <div
            id="qrCodeContainer"
            style={{ width: "100%", height: "300px" }}
          ></div>
        </div>
      ) : (
        <></>
      )}

      <section
        className={styles.rootcontaioner}
        style={{
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <section className={styles.containerrow}>
          <AnimatePresence>
            <motion.div
              initial={boxleft ? { width: 207 } : { width: 298 }}
              animate={boxleft ? { width: 298 } : { width: 207 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={styles.boxleftclosed}
            >
              <div className={styles.boxlefttopclosed}>
                <div className={styles.boxlogocrm}>
                  <div className={styles.boxlogoopen}>
                    <Image
                      src="/logo closed.svg"
                      alt="logo"
                      width={58}
                      height={58}
                    />
                    <AnimatePresence>
                      <motion.img
                        initial={{ display: "none", opacity: 0, x: -10 }}
                        animate={
                          boxleft
                            ? { display: "block", opacity: 1, x: 0 }
                            : { display: "none", opacity: 0, x: -10 }
                        }
                        transition={{ duration: 0.1, ease: "linear" }}
                        src="/Logo text.svg"
                        alt="logo"
                        width={91}
                        height={58}
                      />
                    </AnimatePresence>
                  </div>
                  <div className={styles.crm}>
                    <p>CRM</p>
                  </div>

                  <button onClick={clickboxleftbutton}>
                    <motion.img
                      animate={boxleft ? { rotate: 0 } : { rotate: 180 }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      src="/closeboxleft.svg"
                      alt="open"
                      title="open"
                      width={34}
                      height={34}
                    />
                  </button>
                </div>
                <div className={styles.btnsclosed}>
                  <motion.button
                    onClick={clickbtnmain}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Главная"
                    className={
                      btnmain
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image src="/home.svg" alt="home" width={24} height={24} />
                    <p>{boxleft ? "Главное" : ""}</p>
                  </motion.button>
                  <motion.button
                    onClick={clickbtnreport}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Отчеты"
                    className={
                      btnreport
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image
                      src="/report.svg"
                      alt="home"
                      width={24}
                      height={24}
                    />
                    <p>{boxleft ? "Отчеты" : ""}</p>
                  </motion.button>
                  <motion.button
                    onClick={clickbtncontrol}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Управление билетами"
                    className={
                      btncontrol
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image
                      src="/todayselledticket.svg"
                      alt="home"
                      width={24}
                      height={24}
                    />
                    <p>{boxleft ? "Управление билетами" : ""}</p>
                  </motion.button>
                  <motion.button
                    onClick={clickbtnsettings}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Настройки"
                    className={
                      btnsettings
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image
                      src="/settings.svg"
                      alt="home"
                      width={24}
                      height={24}
                    />
                    <p>{boxleft ? "Настройки" : ""}</p>
                  </motion.button>
                </div>
              </div>
              <button className={styles.logoutclosed} onClick={logout}>
                <Image src="/logout.svg" alt="home" width={24} height={24} />
                <p>Выйти</p>
              </button>
            </motion.div>
          </AnimatePresence>
          <motion.div
            animate={boxleft ? { padding: "38px" } : { padding: "38px 97px" }}
            transition={{ duration: 0.1, ease: "linear" }}
            className={styles.boxright}
            style={{
              overflow: "auto",
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE и Edge */,
            }}
          >
            {btnmain && (
              <div className={styles.boxinboxright}>
                <div className={styles.boxrowinfocashier}>
                  <h1>
                    Главная{" "}
                    <div className={styles.boxdateh1}>
                      <p>{time}</p>
                      <p>{date}</p>
                    </div>
                  </h1>
                  <div className={styles.infocashier}>
                    <div className={styles.boxavatarname}>
                      <Image
                        src="/avatar.png"
                        alt="avatar"
                        width={50}
                        height={50}
                      />
                      <h2>
                        Коптлеулов <br /> Арслан
                      </h2>
                    </div>
                    <div className={styles.cashier}>
                      <p>Cashier</p>
                    </div>
                  </div>
                </div>
                <div className={styles.maincashier}>
                  {/* <div className={styles.boxfastinstrument}>
                    <div className={styles.boxrowfastinstrument}>
                      <div className={styles.boxscanicon}>
                        <Image
                          src="/scanqr.svg"
                          alt="statistic"
                          width={24}
                          height={24}
                        />{" "}
                        <h1>Быстрые инструметы</h1>
                      </div>
                      <div className={styles.boxvibordata}>
                        <p>Выберите дату:</p>
                        <div className={styles.miniboxvibordate}>
                          <div className={styles.boxvibratdatu}>
                            <Image
                              src="/calendar.svg"
                              alt="calendar"
                              width={18}
                              height={18}
                            />
                            <p>Выберите дату</p>
                          </div>
                          <Image
                            src="/rightarrov.svg"
                            alt="right"
                            width={20}
                            height={20}
                          />
                          <div className={styles.boxvibratdatu}>
                            <Image
                              src="/calendar.svg"
                              alt="calendar"
                              width={18}
                              height={18}
                            />
                            <p>Выберите дату</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.boxrowwingets}>
                      <div className={styles.boxonewidget}>
                        <Image
                          src="/allselled.svg"
                          alt="all"
                          width={44}
                          height={44}
                        />
                        <div className={styles.boxonewidgettext}>
                          <p>Всего продано:</p>
                          <h2>24 200 000 UZS</h2>
                        </div>
                      </div>
                      <div className={styles.boxonewidget}>
                        <Image
                          src="/todayselled.svg"
                          alt="all"
                          width={44}
                          height={44}
                        />
                        <div className={styles.boxonewidgettext}>
                          <p>Сегодня продано:</p>
                          <h2>1 200 000 UZS</h2>
                          <div className={styles.boxtreydsuka}>
                            <Image
                              src="/treyd.svg"
                              alt="all"
                              width={20}
                              height={20}
                            />
                            <p>+15% по сравнению со вчерашним днем</p>
                          </div>
                        </div>
                      </div>{" "}
                      <div className={styles.boxonewidget}>
                        <Image
                          src="/todayselledticket.svg"
                          alt="all"
                          width={44}
                          height={44}
                        />
                        <div className={styles.boxonewidgettext}>
                          <p>Количество проданных билетов:</p>
                          <h2>54 шт</h2>
                        </div>
                      </div>{" "}
                    </div>
                  </div> */}
                  {/* <div className={styles.boxstatistic}>
                    <div className={styles.boxrowstatandsort}>
                      <div className={styles.boxrowstatustic}>
                        <Image
                          src="/scanqr.svg"
                          alt="statistic"
                          width={24}
                          height={24}
                        />
                        <p>Статистика Продаж</p>
                      </div>

                      <div className={styles.boxcolsortopen}>
                        <button
                          onClick={clickopensort}
                          className={styles.boxsort}
                        >
                          <p>
                            Сортировка:{" "}
                            <b>{sort1 ? "По цене" : "По количеству продаж"}</b>
                          </p>
                          <AnimatePresence>
                            {opensort ? (
                              <motion.img
                                src="/closesort.svg"
                                alt="close"
                                title="close"
                                width={16}
                                height={16}
                              />
                            ) : (
                              <motion.img
                                animate={{ rotate: 180 }}
                                transition={{ duration: 0.1, ease: "linear" }}
                                src="/closesort.svg"
                                alt="open"
                                title="open"
                                width={16}
                                height={16}
                              />
                            )}
                          </AnimatePresence>
                        </button>
                        <AnimatePresence>
                          {opensort ? (
                            <motion.div
                              animate={opensort ? { y: 40 } : { y: 0 }}
                              transition={{ duration: 0.1, ease: "linear" }}
                              exit={{ y: 0, opacity: 0 }} // Анимация при закрытии
                              className={styles.boxopensort}
                            >
                              <button
                                onClick={clicksort1}
                                disabled={sort1} // Отключаем кнопку, если она уже активна
                                className={sort1 ? styles.disabledButton : ""}
                              >
                                <p>По цене</p>
                              </button>
                              <button
                                onClick={clicksort2}
                                disabled={sort2} // Отключаем кнопку, если она уже активна
                                className={sort2 ? styles.disabledButton : ""}
                              >
                                <p>По количеству продаж</p>
                              </button>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className={styles.boxline}>
                      {sort1 ? (
                        <Line data={chartData} options={options} />
                      ) : (
                        <Line data={chartData2} options={options2} />
                      )}
                    </div>
                  </div> */}
                  <div className={styles.boxrowstatusqr}>
                    <div className={styles.boxscanandstatusqr}>
                      <h1>
                        <div className={styles.imgstatusscan}>
                          <Image
                            src="/scanqr.svg"
                            alt="scan"
                            width={24}
                            height={24}
                          />
                          Статусы сканирования
                        </div>
                        <div className={styles.boxsucsesserror}>
                          <div className={styles.boxscansucsess}>
                            <Image
                              src="scan sucsess.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                            <p>1225</p>
                          </div>
                          <div className={styles.boxscanerror}>
                            <Image
                              src="scan error.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                            <p>13</p>
                          </div>
                        </div>
                      </h1>
                      <div className={styles.boxfixedblock}>
                        <div className={styles.boxonestat}>
                          <p>User ID</p>
                          <p>№ билета</p>
                          <p>Просканировано</p>
                          <p>Кассир</p>
                          <p>Статус</p>
                        </div>
                        <div className={styles.boxscrollstat}>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className={styles.boxtwostat}>
                            <p>12345</p>
                            <p>12345</p>
                            <p>21.12.2024 20:31</p>
                            <p>Антон</p>
                            <Image
                              src="/scansucsessone.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.boxscanandstatusqr}>
                    <h1>
                      <div className={styles.imgstatusscan}>
                        <Image
                          src="/scanqr.svg"
                          alt="scan"
                          width={24}
                          height={24}
                        />
                        Сканирование QR
                      </div>
                    </h1>
                    <div className={styles.boxstatusqrcontent}>
                      <AnimatePresence>
                        <motion.div
                          transition={{ duration: 0.1, ease: "linear" }}
                          className={styles.boxqrimgandtext}
                        >
                          <Image
                            src="/scanerqr.svg"
                            alt="qr"
                            width={34}
                            height={34}
                          />
                          <p>Отсканировать QR</p>
                        </motion.div>
                      </AnimatePresence>
                      <div className={styles.boxrootbtncamera}>
                        <AnimatePresence>
                          <motion.button
                            transition={{ duration: 0.1, ease: "linear" }}
                            onClick={clickcamerabutton}
                            className={styles.btncamera}
                          >
                            <Image
                              src="/camera.svg"
                              alt="camera"
                              width={24}
                              height={24}
                            />
                            <p>Выбрать камеру</p>
                            <AnimatePresence>
                              {camerabutton ? (
                                <motion.img
                                  src="/arrowtop.svg"
                                  alt="arrow"
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <motion.img
                                  animate={{ rotate: 180 }}
                                  transition={{ duration: 0.1, ease: "linear" }}
                                  src="/arrowtop.svg"
                                  alt="arrow"
                                  width={24}
                                  height={24}
                                />
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </AnimatePresence>
                        <AnimatePresence>
                          <motion.div
                            initial={{ y: 50, opacity: 0, display: "none" }}
                            animate={
                              camerabutton
                                ? { y: 70, opacity: 1, display: "flex" }
                                : { y: 50, opacity: 0, display: "none" }
                            }
                            transition={{ duration: 0.1, ease: "linear" }}
                            className={styles.boxcameras}
                          >
                            {/* <button className={styles.onecamera}>
                              <p>{camerabutton ? "камера 1" : ""}</p>
                            </button>
                            <button className={styles.onecamera}>
                              <p>{camerabutton ? "камера 2" : ""}</p>
                            </button> */}
                            {cameras.map((camera) => (
                              <option key={camera.id} value={camera.id}>
                                {camera.label || `${camera.id}`}
                              </option>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        <motion.button
                          onClick={() => setIsEnabled(!isEnabled)}
                          transition={{ duration: 0.1, ease: "linear" }}
                          className={styles.btnscan}
                        >
                          <div>
                            {isEnabled ? (
                              "Остановить сканер"
                            ) : (
                              <p>Сканировать</p>
                            )}
                          </div>
                        </motion.button>
                      </AnimatePresence>
                      {qrMessage ? (
                        <p className={styles.qrMessage}>
                          Считанный QR-код: {qrMessage}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {btnreport && (
              <div className={styles.boxinboxright}>
                <div className={styles.boxrowh1reports}>
                  <h1>Отчеты</h1>
                  <div className={styles.boxdatatimeanddownload}>
                    <div className={styles.boxdateh1}>
                      <p>{time}</p>
                      <p>{date}</p>
                    </div>
                    <div className={styles.boxdownload} title="download">
                      <Image
                        src="/download.svg"
                        alt="download"
                        width={18}
                        height={18}
                      />
                      <p>Скачать как</p>
                      <Image
                        src="/opensort.svg"
                        alt="close"
                        title="close"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.salesreport}>
                  <div className={styles.boxonereport}>
                    <div className={styles.boxrowsalesreport}>
                      <div className={styles.boxh2report}>
                        <Image
                          src="/minireport.svg"
                          alt="report"
                          width={24}
                          height={24}
                        />
                        <p>Отчеты по продажам</p>
                      </div>
                      <div className={styles.downloadreport}>
                        <Image
                          src="/exel.svg"
                          alt="exel"
                          width={16}
                          height={16}
                        />
                        <p>Скачать Xlc</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {btncontrol && <></>}
            {btnsettings && <></>}
          </motion.div>
        </section>
      </section>
    </ClientWrapper>
  );
}

// ---------------------------------------------- Сканер ----------------------------------------------