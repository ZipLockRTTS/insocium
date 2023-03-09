
const LENGTH_CIRCLE = 2 * Math.PI // длина числовой окржуности

class RotateSlider {

    #isScroll = false
    #supportPassive = false
    #wheelOpt
    #x = null

    constructor(boxSelector, options = {}) {
        this.boxSelector = boxSelector
        this.initClass = 'rotate-slider-initialized'
        this.$slider
        this.direction = options.direction || 'vertical'
        this.effect = options.effect || null

        this.wrapperSelector = '.rotate-slider-wrapper'
        this.$wrapper
        this.diameter = 0
        this.radius = 0
        this.rotate = 0

        this.itemSelector = '.rotate-slider-item'
        this.itemActiveClass = 'rotate-slider-item-active'
        this.$items
        this.distancePoints = 0
        this.anglePoints = 0
        this.activeIndex = options.startSlide || 0
        this.$itemActive

        this.thumb = options.thumb || null
        this.thumbActive = false

        this.thumbParent = null
        this.thumbParentActive = false

        this.init()
    }

    static get LENGTH_CIRCLE() { return LENGTH_CIRCLE }

    #initSlider() {
        this.$slider = document.querySelector(this.boxSelector)
        if (!this.$slider)
            throw new RotateSliderError(`${this.boxSelector} не найден.`)

        this.$wrapper = this.$slider.querySelector(this.wrapperSelector)
        if (!this.$wrapper)
            throw new RotateSliderError(`${this.wrapperSelector} не найден.`)

        if (this.effect === 'fade') {
            this.$slider.classList.add(this.initClass)
            return    
        }

        this.diameter = this.$wrapper.offsetHeight
        this.radius = this.diameter / 2
        this.position = 0

        this.$slider.classList.add(this.initClass)
    }

    #initItems() {
        this.$items = this.$wrapper.querySelectorAll(this.itemSelector)
        this.$items = Array.from(this.$items)
        if (!this.$items.length) throw new RotateSliderError('Элементы не найдены.')

        this.$itemActive = this.$items[this.activeIndex]
        this.$itemActive.classList.add(this.itemActiveClass)

        if (!this.effect) {
            this.distancePoints = RotateSlider.LENGTH_CIRCLE / this.$items.length // равное расстония между точками
            this.anglePoints = 360 / this.$items.length // равный угол между точками
            this.#setPositionAll()
        }

        this.slideTo(this.activeIndex)
    }

    #setPositionAll() {
        let step = 0
        this.$items.forEach($item => {
            // распределяем элементы по окружности
            this.#setPosition($item, step)
            step -= this.distancePoints
        })
    }

    #setPosition($elem, angle) {
        /**
         * Устанавливаем элементы строго по центру окружности
         * (необходимо, чтобы граница окружности проходила 
         * через центр элемента)
         */
        const x0 = this.radius - $elem.offsetWidth / 2
        const y0 = this.radius - $elem.offsetHeight / 2

        // вычисляем координаты расположения точки на окружности
        const x = this.radius * Math.cos(angle)
        const y = this.radius * Math.sin(angle)

        let rotate = this.rotate
        if (this.direction === 'horizontal') 
            rotate -= 90

        $elem.style.top = `${y0}px`
        $elem.style.left = `${x0}px`
        $elem.style.transform = `translate(${x}px, ${y}px) rotate(${rotate * -1}deg)`
    }

    #scrollTrigger(ev) {
        if (this.#isScroll)
            return

        const delta = ev.deltaY;
        (delta > 0)
            ? this.next()
            : this.prev()

        this.thumbActive = false
    }

    #getTouch(ev) {
        this.#x = ev.touches[0].clientX
    }

    #touchTrigger(ev) {
        if (!this.#x) return

        this.#x - ev.touches[0].clientX < 0 
            ? this.next()
            : this.prev();

        this.#x = null;
        this.thumbActive = false
    }

    #disableWindowScroll() {
        window.addEventListener('DOMMouseScroll', this.#cancelScroll)
        window.addEventListener('wheel', this.#cancelScroll, this.#wheelOpt)
        window.addEventListener('touchmove', this.#cancelScroll, this.#wheelOpt)
    }

    #enableWindowScroll() {
        window.removeEventListener('DOMMouseScroll', this.#cancelScroll)
        window.removeEventListener('wheel', this.#cancelScroll, this.#wheelOpt)
        window.removeEventListener('touchmove', this.#cancelScroll, this.#wheelOpt)
    }

    #cancelScroll(ev) {
        ev.preventDefault()
    }

    #setActiveItem() {
        this.$itemActive.classList.remove(this.itemActiveClass)
        this.$items[this.activeIndex].classList.add(this.itemActiveClass)
        this.$itemActive = this.$items[this.activeIndex]
        !this.effect && this.#setPosition(this.$itemActive, -this.distancePoints * this.activeIndex)
    }

    #setRotate(rotate) {
        this.$wrapper.style.transform = `rotate(${rotate}deg)`
    }

    init() {
        if (typeof this.boxSelector !== 'string' || this.boxSelector === '')
            throw new RotateSliderError('Не указан селектор.')

        this.#initSlider()
        this.#initItems()

        // add triggers
        try {
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: () => this.#supportPassive = true
            }));
        } catch(e) {}

        this.#wheelOpt = this.#supportPassive ? { passive: false } : false;

        this.$wrapper.addEventListener('wheel', this.#scrollTrigger.bind(this));
        this.$wrapper.addEventListener('touchstart', this.#getTouch.bind(this));
        this.$wrapper.addEventListener('touchmove', this.#touchTrigger.bind(this));

        this.$slider.addEventListener('mousemove', this.#disableWindowScroll.bind(this))
        this.$slider.addEventListener('mouseout', this.#enableWindowScroll.bind(this))
        this.$slider.addEventListener('touchstart', this.#disableWindowScroll.bind(this))
        this.$slider.addEventListener('touchend', this.#enableWindowScroll.bind(this))

        if (this.thumb)
            this.thumb.thumbParent = this
    }

    prev() {
        let timeout
        this.#isScroll = true;

        (this.activeIndex - 1 < 0)
            ? this.activeIndex = this.$items.length - 1
            : this.activeIndex -= 1

        if (!this.effect) {
            this.rotate -= this.anglePoints
            this.#setRotate(this.rotate)
            this.#setPositionAll()
        }

        this.#setActiveItem()

        if (this.thumb && !this.thumb.thumbActive) {
            this.thumbActive = true
            this.thumb.prev()
            this.thumb.thumbActive = false
        }

        if (this.thumbParent && !this.thumbParent.thumbActive) {
            this.thumbActive = true
            this.thumbParent.prev()
            this.thumbParent.thumbActive = false
        }

        timeout = setTimeout(() => {
            this.#isScroll = false
            clearTimeout(timeout)
        }, 250)
    }

    next() {
        let timeout = null
        this.#isScroll = true;

        (this.activeIndex + 1 >= this.$items.length)
            ? this.activeIndex = 0
            : this.activeIndex += 1

        if (!this.effect) {
            this.rotate += this.anglePoints
            this.#setRotate(this.rotate)
            this.#setPositionAll()
        }
        
        this.#setActiveItem()

        if (this.thumb && !this.thumb.thumbActive) {
            this.thumbActive = true
            this.thumb.next()
            this.thumb.thumbActive = false
        }

        if (this.thumbParent && !this.thumbParent.thumbActive) {
            this.thumbActive = true
            this.thumbParent.next()
            this.thumbParent.thumbActive = false
        }

        timeout = setTimeout(() => {
            this.#isScroll = false
            clearTimeout(timeout)
        }, 250)
    }

    slideTo(index) {
        this.activeIndex = index
        this.#setActiveItem()

        if (this.effect)
            return true

        this.rotate = this.anglePoints * index
        this.#setPositionAll()
        this.#setRotate(this.rotate)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(5555);
    try {
        // плашки с текстом
        const sliderOptions = {
            startSlide: 2,
        }

        if (document.documentElement.clientWidth < 575)
            sliderOptions.effect = 'fade'

        const slider = new RotateSlider('#rotateSlide', sliderOptions)

        // кружки
        const circleOptions = {
            startSlide: 2,
            thumb: slider,
        }

        if (document.documentElement.clientWidth < 575)
            circleOptions.direction = 'horizontal'

        const circleSlider = new RotateSlider('#rotateCircle', circleOptions)

        // даты
        const dateOptions = {
            startSlide: 2,
            thumb: circleSlider,
        }

        if (document.documentElement.clientWidth < 575)
            dateOptions.direction = 'horizontal'

        const dateSlider = new RotateSlider('#rotateDate', dateOptions)
    } catch (e) {
        console.error(e)
    }
})