import {Component} from '@angular/core';
@Component({
  moduleId: module.id,
  selector: 'app-logo',
  template: `
    <div class="logo">
        <span class="icon">
          <i class="icon-logo icon-sign"></i>
        </span>
    </div>
  `,
  styles: [
      `.logo {
      text-align: center;
      margin-bottom: 36px;
    }

    .icon-sign {
      display: inline-block;
      background-size: 64px 64px;
      background-repeat: no-repeat;
    }

    .icon-sign {
      background-image: url(/app/shared/logo/already_done.png);
    }

    .icon-logo {
      width: 64px;
      height: 68px;
      background-position: 0 0;
    }
    `
  ]
})
export class LogoComponent {

}
