/// <reference path="../jqwidgets.d.ts" />
import { EventEmitter, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
export declare class jqxRepeatButtonComponent implements OnChanges {
    attrDelay: number;
    attrDisabled: boolean;
    attrImgSrc: string;
    attrImgWidth: number | string;
    attrImgHeight: number | string;
    attrImgPosition: string;
    attrRoundedCorners: string;
    attrRtl: boolean;
    attrTextPosition: string;
    attrTextImageRelation: string;
    attrTheme: string;
    attrTemplate: string;
    attrToggled: boolean;
    attrValue: string;
    attrWidth: string | number;
    attrHeight: string | number;
    autoCreate: boolean;
    properties: string[];
    host: any;
    elementRef: ElementRef;
    widgetObject: jqwidgets.jqxRepeatButton;
    constructor(containerElement: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): boolean;
    arraysEqual(attrValue: any, hostValue: any): boolean;
    manageAttributes(): any;
    moveClasses(parentEl: HTMLElement, childEl: HTMLElement): void;
    moveStyles(parentEl: HTMLElement, childEl: HTMLElement): void;
    createComponent(options?: any): void;
    createWidget(options?: any): void;
    __updateRect__(): void;
    setOptions(options: any): void;
    delay(arg?: number): number;
    disabled(arg?: boolean): boolean;
    height(arg?: number | string): number | string;
    imgSrc(arg?: string): string;
    imgWidth(arg?: number | string): number | string;
    imgHeight(arg?: number | string): number | string;
    imgPosition(arg?: string): string;
    roundedCorners(arg?: string): string;
    rtl(arg?: boolean): boolean;
    textPosition(arg?: string): string;
    textImageRelation(arg?: string): string;
    theme(arg?: string): string;
    template(arg?: string): string;
    toggled(arg?: boolean): boolean;
    width(arg?: string | number): string | number;
    value(arg?: string): string;
    destroy(): void;
    focus(): void;
    render(): void;
    val(value?: string): any;
    onClick: EventEmitter<any>;
    __wireEvents__(): void;
}
