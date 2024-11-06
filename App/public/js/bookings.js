document.getElementById('service').addEventListener('change', function(e) {
  const serviceId = e.target.value;
  const questionsContainer = document.getElementById('questions-container');
  questionsContainer.innerHTML = ''; // Clear previous questions

  if (!serviceId) return;

  // Find the selected service
  const selectedService = services.find(service => service.id === serviceId);
  if (!selectedService || !selectedService.customQuestions) return;

  // Create elements for each custom question
  selectedService.customQuestions.forEach(questionRef => {
    // Find the full question definition
    const questionDef = customQuestions.find(q => q.id === questionRef.questionId);
    if (!questionDef) return;

    const questionDiv = document.createElement('div');
    questionDiv.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = `question_${questionDef.id}`;
    label.textContent = questionDef.displayName;
    questionDiv.appendChild(label);

    if (questionDef.answerInputType === 'radioButton') {
      const select = document.createElement('select');
      select.name = `question_${questionDef.id}`;
      select.id = `question_${questionDef.id}`;
      if (questionRef.isRequired) {
        select.required = true;
      }

      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select an option...';
      select.appendChild(defaultOption);

      // Add options from answerOptions
      questionDef.answerOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });

      questionDiv.appendChild(select);
    } else if (questionDef.answerInputType === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `question_${questionDef.id}`;
      input.id = `question_${questionDef.id}`;
      if (questionRef.isRequired) {
        input.required = true;
      }

      questionDiv.appendChild(input);
    }
    // Add support for other answer types here as needed

    questionsContainer.appendChild(questionDiv);
  });
});

function formatDateWithTimezone(date) {
  let isoString = date.toISOString();
  return isoString.replace('Z', '+00:00');
}

function combineDateAndTime(date, time) {
  let [hours, minutes] = time.split(':');
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function formatDateForDisplay(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

const progressContainer = document.getElementById('progress-container');
const progressCount = document.getElementById('progress-count');
const totalCount = document.getElementById('total-count');
const successCount = document.getElementById('success-count');
const failedCount = document.getElementById('failed-count');
const failedList = document.getElementById('failed-list');
const submitButton = document.querySelector('button[type="submit"]');

document.getElementById('bookings-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get selected service
  const serviceId = document.getElementById('service').value;

  // Get selected staff members
  const staffMemberIds = Array.from(document.querySelectorAll('.staff-check:checked'))
    .map(checkbox => checkbox.value);

  // Get custom question answers
  const customQuestionAnswers = [];
  const selectedService = services.find(service => service.id === serviceId);
  if (selectedService && selectedService.customQuestions) {
    selectedService.customQuestions.forEach(questionRef => {
      const select = document.getElementById(`question_${questionRef.questionId}`);
      const question = customQuestions.find(q => q.id === questionRef.questionId);
      if (select) {
        customQuestionAnswers.push({
          questionId: questionRef.questionId,
          answer: select.value,
          selectedOptions: [select.value],
          isRequired: questionRef.isRequired,
          question: question.displayName,
          answerInputType: question.answerInputType,
          answerOptions: question.answerOptions
        });
      }
    });
  }

  // Get selected days
  const selectedDays = new Set(
    Array.from(document.querySelectorAll('input[name="days"]:checked'))
      .map(checkbox => parseInt(checkbox.value))
  );

  // Get date range
  const startDate = new Date(document.getElementById('start_date').value);
  const endDate = new Date(document.getElementById('end_date').value);
  const startTime = document.getElementById('start_time').value;
  const endTime = document.getElementById('end_time').value;

  // Generate dates array
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (selectedDays.has(currentDate.getDay())) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  progressContainer.style.display = 'block';
  failedList.innerHTML = '';
  let success = 0, failed = 0;

  totalCount.textContent = dates.length;
  submitButton.disabled = true;
  submitButton.textContent = 'Processing Bookings...';

  const customerId = document.getElementById('customer').value;

  dates.forEach(async date => {
    const bookingData = {
      serviceId,
      staffMemberIds,
      startDateTime: {
        "dateTime": formatDateWithTimezone(combineDateAndTime(date, startTime)),
        "timeZone": 'UTC'
      },
      endDateTime: {
        "dateTime": formatDateWithTimezone(combineDateAndTime(date, endTime)),
        "timeZone": 'UTC'
      },
      customers: [
        {
          "@odata.type": "#microsoft.graph.bookingCustomerInformation",
          customerId,
          customQuestionAnswers
        }
      ]
    };

    try {
      await axios.post('bookings/create', bookingData);
      success++;
      successCount.textContent = success;
    } catch (e) {
      failed++;
      failedCount.textContent = failed;

      const listItem = document.createElement('li');
      listItem.textContent = formatDateForDisplay(date);
      failedList.appendChild(listItem);

      console.error(e);
    }

    progressCount.textContent = success + failed;

    if (success + failed >= dates.length) {
      // Re-enable submit button and update text
      submitButton.disabled = false;
      submitButton.textContent = 'Book Appointment';

      const completionMessage = document.createElement('p');
      completionMessage.style.marginTop = '10px';
      completionMessage.style.fontWeight = 'bold';
      if (failed === 0) {
        completionMessage.style.color = '#2ecc71';
        completionMessage.textContent = 'All bookings completed successfully!';
      } else {
        completionMessage.style.color = '#e74c3c';
        completionMessage.textContent = `Booking completed with ${failed} error${failed > 1 ? 's' : ''}.`;
      }
      progressContainer.appendChild(completionMessage);
    }
  })
});
