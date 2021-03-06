
var ciudadOpcion
var urlAjax
var TableDataShow
var TableDataOpenW
var TableDataAccuW

var apiKeyOpenWeather = '2d6877f7a0ae66578fe86eff5e7b0543'
var apiKeyAccuWeather = 'KvYYVoqAgcv4MZ25L1eYBI2TJN3E3mGT'
						/* 
							apiKey AccuWeather 
								jojocojo@hotmail.com
								KvYYVoqAgcv4MZ25L1eYBI2TJN3E3mGT

								josejoaquin192@hotmail.com
								XeciObcdoUj6OCGIRQ9HkaEOYNh4y8C8
						*/
var optionsChart = {
						chart: {
							renderTo: '',
							defaultSeriesType: 'column'
						},
						title: {
							text: ''
						},
						xAxis: {
							categories: []
						},
						yAxis: {
							title: {
							text: ''
						}
						},
						series: [{
							type: '',
						    name: '',
						    data: []
						}, {
							type: '',
						    name: '',
						    data: []
						}, {
							type: '',
						    name: '',
						    data: []
						}, {
							type: '',
						    name: '',
						    data: []
						}, {
							type: '',
						    name: '',
						    data: []
						}, ]
					}
var nombreMeses = [
	'Ene', 'Feb', 'Mar',
	'Abr', 'May', 'Jun', 'Jul',
	'Ago', 'Sep', 'Oct',
	'Nov', 'Dic'
]

var nombreDias = [
	'Dom', 'Lun', 'Mar',
	'Mie', 'Jue', 'Vie',
	'Sáb', 'Dom'
]
					

$(document).ready(function (){
	
	TableDataShow = $('#DataTableOpenW, #DataTableAccuW')
	TableDataShow = mostrarDataTable()
	$('#obtenerClimaOpen').on('click', function(e){

		e.preventDefault()
		obtenerClimaOpenWeather()

	})

	$('#obtenerClimaAccu').on('click', function(e){

		e.preventDefault()
		obtenerClimaAccuWeather()

	})

	temaHighCharts()
})

function obtenerClimaOpenWeather() {

	ciudadOpcion = $('#ciudadOpenWeather').val()

	if (ciudadOpcion === null ||  ciudadOpcion === ''){

		swal(
			'¿Ha escrito una ciudad?', 
			'Debe de escribir una ciudad para poder mostrar los datos',
			'question'
			)

	} else {

		urlAjax = 'https://api.openweathermap.org/data/2.5/forecast?q='+ ciudadOpcion.trim() +'&lang=es&units=metric&APPID=' + apiKeyOpenWeather.trim()
		$.ajax({

			url: urlAjax,
			beforeSend: function(xhr){
				swal({
					title: 'Procesando, por favor espere...',        
				    onOpen: function () {
				        swal.showLoading()
				    }
				})

			}

		}).done(function(response) {

			TableDataOpenW = $('#DataTableOpenW').DataTable()
			TableDataOpenW.destroy()

			$('#tbodyClimaOpenWeather').empty();

			$.each(response.list, function(i){

				$('#tbodyClimaOpenWeather').append(
					'<tr>'+
						'<td>'+(i+1)+'</td>'+
						'<td>'+formatearFechaISO8601(response.list[i].dt_txt)+', '+ formatearHoraISO8601(response.list[i].dt_txt) +'</td>'+
						'<td>'+response.city.name+', '+response.city.country+ '</td>'+
						'<td>'+
							'<img src="http://openweathermap.org/img/w/'+response.list[i].weather[0].icon.trim()+'.png" alt="'+response.list[i].weather[0].description+'" /> '+response.list[i].weather[0].description+
						'</td>'+
						'<td>'+response.list[i].main.temp+' °C</td>'+
						'<td>'+response.list[i].main.temp_max+' °C</td>'+
						'<td>'+response.list[i].main.temp_min+' °C</td>'+
						'<td>'+response.list[i].main.humidity+'%</td>'+
						'<td>'+response.list[i].wind.speed+' km/h</td>'+
						'<th>'+response.list[i].main.pressure+' hPa</th>'+
						'<th>'+response.list[i].clouds.all+' %</th>'+
					'</tr>'
				)

			})

			TableDataOpenW = mostrarDataTable('DataTableOpenW')
			$('#botonGraficaOpen').show()
			swal.close()

		}).fail(function(jqXHR, textStatus){

			$('#botonGraficaOpen').hide()
			swal.close()

			if (jqXHR.responseJSON.message === 'Nothing to geocode') {
				
				swal({
					title: 'Ocurrio un error',
					type: 'error',
					text: textStatus+': ' + 'No debe dejar vacío el campo de busqueda'
				})

			}else{

				swal({
					title: 'Ocurrio un error',
					type: 'error',
					text: 'Algo salio mal :/'
				})

			}
		})
	}
}

function obtenerClimaAccuWeather() {

	ciudadOpcion = $('#ciudadAccuWeather').val()

	if (ciudadOpcion === null ||  ciudadOpcion === ''){

		swal(
			'¿Ha seleccionado una ciudad?', 
			'Debe de seleccionar una ciudad para poder mostrar los datos',
			'question'
			)

	}else{

		urlAjax = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + ciudadOpcion.trim() +'?apikey=' + apiKeyAccuWeather.trim() + '&language=es-MX&details=true&metric=true'
		$.ajax({

			url: urlAjax,
			beforeSend: function(xhr){
				swal({
					title: 'Procesando, por favor espere...',        
				    onOpen: function () {
				        swal.showLoading()
				    }
				})

			}

		}).done(function(response) {

			TableDataAccuW = $('#DataTableAccuW').DataTable()
			TableDataAccuW.destroy()

			$('#tbodyClimaAccuWeather').empty()
			
			$.each(response.DailyForecasts, function(i, val){

				var iconResponse = "0" + response.DailyForecasts[i].Day.Icon

				$('#tbodyClimaAccuWeather').append(
					'<tr>'+
						'<td>'+formatearFechaISO8601(response.DailyForecasts[i].Date)+'</td>'+
						//'<td><img src="https://vortex.accuweather.com/adc2010/images/slate/icons/'+iconResponse.substr(-2)+'.svg" alt="'+response.DailyForecasts[i].Day.IconPhrase+'" height="30px" /> '+response.DailyForecasts[i].Day.LongPhrase+'</td>'+
						'<td><img src="https://developer.accuweather.com/sites/default/files/'+iconResponse.substr(-2)+'-s.png" alt="'+response.DailyForecasts[i].Day.IconPhrase+'" height="30px" /> '+response.DailyForecasts[i].Day.LongPhrase+'</td>'+
						'<td>'+response.DailyForecasts[i].RealFeelTemperature.Minimum.Value+' °'+response.DailyForecasts[i].RealFeelTemperature.Minimum.Unit+' / '+response.DailyForecasts[i].RealFeelTemperature.Maximum.Value+' °'+response.DailyForecasts[i].RealFeelTemperature.Maximum.Unit+'</td>'+
						'<td>'+response.DailyForecasts[i].Temperature.Maximum.Value+' °'+response.DailyForecasts[i].Temperature.Maximum.Unit+' / '+response.DailyForecasts[i].Temperature.Minimum.Value+' °'+response.DailyForecasts[i].Temperature.Minimum.Unit+'</td>'+
						'<td>'+response.DailyForecasts[i].Day.PrecipitationProbability+' %</td>'+
						'<td>'+response.DailyForecasts[i].Day.ThunderstormProbability+' %</td>'+
						'<td>'+response.DailyForecasts[i].Day.Wind.Speed.Value +' '+response.DailyForecasts[i].Day.Wind.Speed.Unit+'</td>'+
						'<th>'+ formatearHoraISO8601(response.DailyForecasts[i].Sun.Rise) +'</th>'+
						'<th>'+ formatearHoraISO8601(response.DailyForecasts[i].Sun.Set) +'</th>'+
					'</tr>'
					)
				optionsChart.series[0].data[i] = response.DailyForecasts[i].Temperature.Maximum.Value
				optionsChart.series[1].data[i] = response.DailyForecasts[i].Temperature.Minimum.Value
				optionsChart.series[2].data[i] = response.DailyForecasts[i].RealFeelTemperature.Minimum.Value
				optionsChart.series[3].data[i] = response.DailyForecasts[i].RealFeelTemperature.Maximum.Value
				optionsChart.series[4].data[i] = response.DailyForecasts[i].RealFeelTemperature.Minimum.Value

				optionsChart.xAxis.categories[i] = formatearFechaISO8601(response.DailyForecasts[i].Date)

			})

			TableDataAccuW = mostrarDataTable('DataTableAccuW')

			optionsChart.title.text = 'Temperatura'
			optionsChart.chart.renderTo = 'containerChartAccuTempMaxMin'
			optionsChart.chart.defaultSeriesType = 'spline'
			optionsChart.yAxis.title.text = 'Grados °C'

			optionsChart.series[0].type = 'spline'
			optionsChart.series[0].name = 'Tem. Máx.'

			optionsChart.series[1].type = 'column'
			optionsChart.series[1].name = 'Tem. Min.'

			optionsChart.series[2].type = 'spline'
			optionsChart.series[2].name = 'Sen. Ter. Min.'

			optionsChart.series[3].type = 'column'
			optionsChart.series[3].name = 'Sen. Ter. Máx.'

			optionsChart.series[4].type = 'spline'
			optionsChart.series[4].name = 'Sen. Ter. Min.'

			var chart = new Highcharts.chart(optionsChart)

			/*
			Highcharts.chart('containerChartAccuSenTerMaxMin', {
			    title: {
			    	text: 'Sensación Térmica'
			    },
			    xAxis: {
			        categories: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: 'Temperatura (°C)'
			        }
			    },
			    series: [{
			    	type: 'column',
			        name: 'Sen. Ter. Máx.',
			        data: [
			        	response.DailyForecasts[0].RealFeelTemperature.Maximum.Value,
			        	response.DailyForecasts[1].RealFeelTemperature.Maximum.Value,
			        	response.DailyForecasts[2].RealFeelTemperature.Maximum.Value,
			        	response.DailyForecasts[3].RealFeelTemperature.Maximum.Value,
			        	response.DailyForecasts[4].RealFeelTemperature.Maximum.Value
			        	]
			    },{
			    	type: 'column',
			        name: 'Sen. Ter. Min.',
			        data: [
			        	response.DailyForecasts[0].RealFeelTemperature.Minimum.Value,
			        	response.DailyForecasts[1].RealFeelTemperature.Minimum.Value,
			        	response.DailyForecasts[2].RealFeelTemperature.Minimum.Value,
			        	response.DailyForecasts[3].RealFeelTemperature.Minimum.Value,
			        	response.DailyForecasts[4].RealFeelTemperature.Minimum.Value
			        	]
			    }
			    ]
			})
			*/
			
			$('#botonGraficaAccuTempMaxMin, #botonGraficaAccuSenTerMaxMin').show()
			swal.close()
			
		}).fail(function(jqXHR, textStatus){
			
			$('#botonGraficaAccuTempMaxMin, #botonGraficaAccuSenTerMaxMin').hide()
			swal.close()

			if (textStatus === 'error') {
				
				swal({
					title: 'Ocurrio un error',
					type: 'error',
					text: 'Algo salio mal :/'
				})

			}
		})
	}
}

function temaHighCharts(){
	Highcharts.createElement('link', {
	   href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
	   rel: 'stylesheet',
	   type: 'text/css'
	}, null, document.getElementsByTagName('head')[0]);

	Highcharts.theme = {
	   colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
	      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
	   chart: {
	      backgroundColor: null,
	      style: {
	         fontFamily: 'Dosis, sans-serif'
	      }
	   },
	   title: {
	      style: {
	         fontSize: '16px',
	         fontWeight: 'bold',
	         textTransform: 'uppercase'
	      }
	   },
	   tooltip: {
	      borderWidth: 0,
	      backgroundColor: 'rgba(219,219,216,0.8)',
	      shadow: false
	   },
	   legend: {
	      itemStyle: {
	         fontWeight: 'bold',
	         fontSize: '13px'
	      }
	   },
	   xAxis: {
	      gridLineWidth: 1,
	      labels: {
	         style: {
	            fontSize: '12px'
	         }
	      }
	   },
	   yAxis: {
	      minorTickInterval: 'auto',
	      title: {
	         style: {
	            textTransform: 'uppercase'
	         }
	      },
	      labels: {
	         style: {
	            fontSize: '12px'
	         }
	      }
	   },
	   plotOptions: {
	      candlestick: {
	         lineColor: '#404048'
	      }
	   },
	   // General
	   background2: '#F0F0EA'
	};
	// Apply the theme
	Highcharts.setOptions(Highcharts.theme);
}

function mostrarDataTable (idTable){
	
	if (idTable === null || idTable === undefined) {
		
		TableDataShow.DataTable({
			"lengthMenu": [
	            [5, 10, 25, 50, 100, -1], 
	            [5, 10, 25, 50, 100, "Todos"]
	          ],
	          "iDisplayLength": 5,
	          "language": {
	                "sProcessing":     "Procesando...",
	                "sLengthMenu":     "Mostrar _MENU_ registros",
	                "sZeroRecords":    "No se encontraron resultados",
	                "sEmptyTable":     "Ningún registro disponible.",
	                "sInfo":           "Mostrando de _START_ - _END_ de un total de _TOTAL_ registros",
	                "sInfoEmpty":      "Mostrando del 0 al 0 de un total de 0 registros",
	                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
	                "sInfoPostFix":    "",
	                "sSearch":         "Buscar:",
	                "sUrl":            "",
	                "sInfoThousands":  ",",
	                "sLoadingRecords": "Cargando...",
	                "oPaginate": {
	                    "sFirst":    "Primero",
	                    "sLast":     "Último",
	                    "sNext":     "Siguiente",
	                    "sPrevious": "Anterior"
	                },
	                "oAria": {
	                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
	                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
	                }
			}

		})

	}else{

		TableDataShow = $('#'+idTable+'').DataTable({
			"lengthMenu": [
	            [5, 10, 25, 50, 100, -1], 
	            [5, 10, 25, 50, 100, "Todos"]
	          ],
	          "iDisplayLength": 5,
	          "language": {
	                "sProcessing":     "Procesando...",
	                "sLengthMenu":     "Mostrar _MENU_ registros",
	                "sZeroRecords":    "No se encontraron resultados",
	                "sEmptyTable":     "Ningún registro disponible.",
	                "sInfo":           "Mostrando de _START_ - _END_ de un total de _TOTAL_ registros",
	                "sInfoEmpty":      "Mostrando del 0 al 0 de un total de 0 registros",
	                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
	                "sInfoPostFix":    "",
	                "sSearch":         "Buscar:",
	                "sUrl":            "",
	                "sInfoThousands":  ",",
	                "sLoadingRecords": "Cargando...",
	                "oPaginate": {
	                    "sFirst":    "Primero",
	                    "sLast":     "Último",
	                    "sNext":     "Siguiente",
	                    "sPrevious": "Anterior"
	                },
	                "oAria": {
	                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
	                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
	                }
			}

		})

	}

	return TableDataShow
}

function formatearUnixTimeHora (UnixTime){
	var SinFormato = new Date(UnixTime*1000)
	var Horas = SinFormato.getHours()
	var Minutos = "0" + SinFormato.getMinutes()
	var Formato = Horas + ':' + Minutos.substr(-2)

	return Formato
}

function formatearUnixTimeFecha (UnixTime){

	var SinFormato = new Date(UnixTime*1000)

	var dia = SinFormato.getDate()
	var diaIndex = SinFormato.getDay()
	var mesIndex = SinFormato.getMonth()
	var anio = SinFormato.getFullYear()
	var Formato = nombreDias[diaIndex]+ ', ' +dia + '/' + nombreMeses[mesIndex] + '/' + anio

	return Formato
}

function formatearHoraISO8601(fechaISO){
	
	var SinFormato = new Date(fechaISO)
	var Horas = SinFormato.getHours()
	var Minutos = "0" + SinFormato.getMinutes()
	var Formato = Horas + ':' + Minutos.substr(-2)
	
	return Formato
}

function formatearFechaISO8601(fechaISO){

	var SinFormato = new Date(fechaISO)
	var dia = SinFormato.getDate()
	var diaIndex = SinFormato.getDay()
	var mesIndex = SinFormato.getMonth()
	var anio = SinFormato.getFullYear()
	var Formato = nombreDias[diaIndex]+ ', ' +dia + '/' + nombreMeses[mesIndex] + '/' + anio

	return Formato
}