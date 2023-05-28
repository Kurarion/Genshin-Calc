import { animate, animateChild, group, keyframes, query, state, style, transition, trigger } from "@angular/animations";

export const routerAnimation = trigger('routeAnimations', []);

export const STATE_SHOW = 'show';
export const STATE_HIDDEN = 'hidden';
export const headerDownloadAnimation = trigger(
    'download',
    [
        state(STATE_HIDDEN, style({
            width: '0',
            visibility: 'hidden',
        })),
        state(STATE_SHOW, style({
            visibility: 'visible',
        })),
        transition(STATE_HIDDEN + ' <=> ' + STATE_SHOW, [
            animate('0.5s')
        ])
    ]
)

export const SHOW = '1';
export const DISAPPEAR = '0';
export const footerContentAnimation = trigger(
    'contentChange',
    [
        state(SHOW, style({ opacity: 1 })),
        state(DISAPPEAR, style({ opacity: 0 })),
        transition(DISAPPEAR + ' <=> ' + SHOW, [
            animate('0.5s')
        ])
    ]
)

export const CSS_STATUS_BEFORE = "beforeLoad";
export const CSS_STATUS_FIN = "loaded";
export const homePageImgLoadAnimation = trigger(
    'imgLoad',
    [
        state(CSS_STATUS_BEFORE, style({
            opacity: 0.01,
        })),
        state(CSS_STATUS_FIN, style({
            opacity: 0.4,
        })),
        transition(CSS_STATUS_BEFORE + '=>' + CSS_STATUS_FIN, [
            animate('1s')
        ]),
        transition(CSS_STATUS_FIN + '=>' + CSS_STATUS_BEFORE, [
            animate('0.2s')
        ])
    ]
)
export const homePageOtherLoadAnimation = trigger(
    'otherLoad',
    [
        state(CSS_STATUS_BEFORE, style({
            opacity: 0.01,
        })),
        state(CSS_STATUS_FIN, style({
            opacity: 1,
        })),
        transition(CSS_STATUS_BEFORE + '=>' + CSS_STATUS_FIN, [
            animate('0.5s')
        ]),
        transition(CSS_STATUS_FIN + '=>' + CSS_STATUS_BEFORE, [
            animate('0.2s')
        ])
    ]
)
export const characterMainImgLoadAnimation = trigger(
    'imgLoad',
    [
        state(CSS_STATUS_BEFORE, style({
            opacity: 0.01,
        })),
        state(CSS_STATUS_FIN, style({
            opacity: 0.16,
        })),
        transition(CSS_STATUS_BEFORE + '=>' + CSS_STATUS_FIN, [
            animate('1s')
        ]),
        transition(CSS_STATUS_FIN + '=>' + CSS_STATUS_BEFORE, [
            animate('0.2s')
        ])
    ]
)
export const characterMainOtherLoadAnimation = trigger(
    'otherLoad',
    [
        state(CSS_STATUS_BEFORE, style({
            opacity: 0.01,
        })),
        state(CSS_STATUS_FIN, style({
            opacity: 1,
        })),
        transition(CSS_STATUS_BEFORE + '=>' + CSS_STATUS_FIN, [
            animate('0.5s')
        ]),
        transition(CSS_STATUS_FIN + '=>' + CSS_STATUS_BEFORE, [
            animate('0.2s')
        ])
    ]
)

export const STATE_NORMAL = 'normal'
export const STATE_SPIN_LOOP_1 = 'spinLoop1'
export const STATE_SPIN_LOOP_2 = 'spinLoop2'
export const enkaIconLoadAnimation = trigger(
    'enkaLoad',
    [
        transition(STATE_NORMAL + '=> *', [
            animate('0.1s ease-out'),
        ]),
        transition('* =>' + STATE_NORMAL, [
            animate('0.6s ease-out'),
        ]),
        transition(STATE_SPIN_LOOP_1 + ' <=>' + STATE_SPIN_LOOP_2, [
            animate('2.6s ease-in-out',
            keyframes([
                style({ transform: 'rotate(0)', offset: 0 }),
                style({ transform: 'rotate(360deg)', offset: 1.0 }),
            ])),
        ])
    ]
)