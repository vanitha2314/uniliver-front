import {
  animate,
  animateChild,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  state('*', style({})),
  state('void', style({ opacity: 0 })),
  transition(':enter', [animate('{{duration}} {{delay}}'), animateChild()], {
    params: { duration: '0.2s', delay: '0s' },
  }),
]);
