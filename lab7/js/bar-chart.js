class BarChart{
    #svgns;
    #domElement;
    #svg;
    #width;
    #height;

    #createSVG(){
        this.#svg = document.createElementNS(this.#svgns, "svg");
             
        this.#svg.style.borderColor = 'black';
        this.#svg.style.borderWidth = '1px';
        this.#svg.style.borderStyle = 'solid';
        //or
        //this.#svg.setAttribute('style', 'border: 1px solid black'); 
        
        this.#svg.setAttribute('width', this.#width); //note: this.#svg.width is readonly
        this.#svg.setAttribute('height', this.#height);
        this.#domElement.appendChild(this.#svg);
    }

    #drawBackground(){
        const rect = document.createElementNS(this.#svgns, 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('height', this.#height);
        rect.setAttribute('width', this.#width);
    
        rect.style.fill = '#fefefe';
        //rect.setAttribute("fill", 'WhiteSmoke'); //! not recommended

        // rect.addEventListener('click', e => {
        //     // e.target.style.fill = e.target.style.fill === 'red' ? '#fefefe' : 'red';
        //     // e.target.style.fill = 'red';
        //     // setInterval(() => e.target.style.fill = e.target.style.fill === 'red' ? '#fefefe' : 'red', 2000);
        // });
    
        this.#svg.appendChild(rect);
    }

    #drawBars(data){
        const barWidth = this.#width / data.length;
    
        const f = this.#height / Math.max(...data.map(x=>x[1]));
    
        for(let i=0; i<data.length; i++){
    
            const label = data[i][0];
            const value = data[i][1];
    
            const barHeight = value * f * 0.9;
            const barY = this.#height - barHeight;
            const barX = i * barWidth + barWidth/4;
    
            const bar = document.createElementNS(this.#svgns, 'rect');
            bar.setAttribute('class','bar');
            //or
            //bar.classList.add('bar'); //!recommended
            bar.setAttribute('x', barX);
            bar.setAttribute('y', barY);
            bar.setAttribute('height', barHeight);
            bar.setAttribute('width', barWidth/2);
    
            //note: if the styles are set using CSS .bar:hover {...} will only work if marked as !important
            //the styling should be moved to the .bar {...} instead
            bar.style.fill = '#db4437';
            bar.style.strokeWidth = 2;
            bar.style.stroke = "black";

            bar.addEventListener('mouseover', e => {
                const tooltip = document.getElementById("tooltip");
                tooltip.textContent = label + ': ' + value;
                tooltip.style = 'display: block; position: absolute; left: ' + e.clientX + 'px; top: ' + e.clientY + 'px;';
            });

            bar.addEventListener('mouseleave', e => {
                const tooltip = document.getElementById("tooltip");
                tooltip.style = 'display: none;';
            });

            this.#svg.appendChild(bar);
        }
    }

    constructor(domElement) {
        this.#domElement = domElement;
        this.#svgns  = "http://www.w3.org/2000/svg";
    }

    draw(data){
        this.#width = this.#domElement.clientWidth;
        this.#height = this.#domElement.clientHeight;
        this.#createSVG();
        this.#drawBackground();
        this.#drawBars(data);
    }
}