$(document).ready(function() {

  //

});

function weeklyViewChart (data) {
    new Chart(
        document.getElementById('weekly_views'),
        {
          type: 'line',
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
            },
            scales: {
              y: {
                  suggestedMin: 20,
                  suggestedMax: 40
              }
            }
          },
          data: {
            labels: Object.keys(data),
            datasets: [
              {
                label: 'Daily Views',
                data: Object.values(data),
                borderColor: '#435ebe',
              }
            ]
          }
        }
    );
}

function yearlyViewChart (data) {
  new Chart(
      document.getElementById('yearly_views'),
      {
        type: 'line',
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
          },
          scales: {
            y: {
                suggestedMin: 20,
                suggestedMax: 40
            }
          }
        },
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: 'Monthly Views',
              data: Object.values(data),
              borderColor: '#435ebe',
            }
          ]
        }
      }
  );
}