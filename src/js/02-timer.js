import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  datetimePicker: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];


    const currentDate = Date.now();
    if (selectedDate < currentDate) {
      Notify.failure('Please choose a date in the future');
      refs.startBtn.disabled = true;
      return;
    }

    refs.startBtn.disabled = false;
    let intervalId = null;

    refs.startBtn.addEventListener('click', startCountdown);


    function startCountdown() {
      refs.startBtn.disabled = true;
      refs.datetimePicker.disabled = true;

    
      intervalId = setInterval(() => {
        const currentDate = Date.now();
        if (selectedDate < currentDate) {
          clearInterval(intervalId);
          refs.datetimePicker.disabled = false;
          return;
        }

        const timeDifference = selectedDate - currentDate;
        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        refs.days.textContent = addLeadingZero(days);
        refs.hours.textContent = addLeadingZero(hours);
        refs.minutes.textContent = addLeadingZero(minutes);
        refs.seconds.textContent = addLeadingZero(seconds);
      });
    }
  },
};

flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0'); //01
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}