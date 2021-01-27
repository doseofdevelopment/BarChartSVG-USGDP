const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const req = new XMLHttpRequest()

req.open('GET', dataset, true)
req.onload = () => {
    let data = JSON.parse(req.responseText)
    let values = data.data

    // Canvas setup
    let svg = d3.select('svg')
    let width = 800
    let height = 500
    let padding = 40
    svg.attr('width', width)
    svg.attr('height', height)

    // Define scales
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(values, (d) => {
            return d[1]
        })])
        .range([0, height - 2 * padding])

    let xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding])

    let datesArray = values.map((d) => {
        return new Date(d[0])
    })

    let xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding])

    let yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, (d) => {
            return d[1]
        })])
        .range([height - padding, padding])

    //Setup axises
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')

    //Create tooltip to display selected bar values
    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto')

    //Create bars for chart
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - 2 * padding) / values.length)
        .attr('data-date', (d) => {
            return d[0]
        })
        .attr('data-gdp', (d) => {
            return d[1]
        })
        .attr('height', (d) => {
            return yScale(d[1])
        })
        .attr('x', (d, i) => {
            return xScale(i)
        })
        .attr('y', (d, i) => {
            return (height - padding) - yScale(d[1])
        })

        //Code for tooltip updating 
        .on('mouseover', (d, i) => {

            tooltip.transition()
                .style('visibility', 'visible')
            // .style('background-color', 'white')
            tooltip
                .html(d[0] + '<br>' + '$' + d[1] + ' Billion')
            document.querySelector('#tooltip').setAttribute('data-date', d[0])
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })

}
req.send()