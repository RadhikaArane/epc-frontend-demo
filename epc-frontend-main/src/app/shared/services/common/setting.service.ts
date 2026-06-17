// import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { CommonService } from './common.service'; 


// @Injectable({
//   providedIn: 'root',
// })
// export class SettingService {
//   private renderer: Renderer2;
//   base = '';
//   page = '';
//   last = '';

//   // Layout Mode
//   public layoutMode: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('layoutMode') || 'default'
//   );

//   // Layout Width
//   public layoutWidth: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('layoutWidth') || '1'
//   );
//   // Card Style
//   public cardStyle: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('cardStyle') || '1'
//   );
//   // Sidebar Color
//   public sidebarColor: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('sidebarColor') || '1'
//   );
//   public sidebarColor2: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('sidebarColor2') || '1'
//   );
//     // Theme Color
//     public themeColor: BehaviorSubject<string> = new BehaviorSubject<string>(
//       localStorage.getItem('themeColor') || '1'
//     );
//   // Sidebar Size
//   public sidebarSize: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('sidebarSize') || '1'
//   );
//   // Topbar Color
//   public topbarColor: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('topbarColor') || 'white'
//   );
//   public topbarColor2: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('topbarColor2') || '1'
//   );
//   public topbarColor3: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('topbarColor3') || '1'
//   );

//   public topbarColor4: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('topbarColor4') || '1'
//   );
//   public primaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('primaryColor') || '1'
//   );
//   public primaryColor1: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('primaryColor1') || '1'
//   );
//   public isLoader: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('isLoader') || '1'
//   );
//   public sidebarImage: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('sidebarImage') || '1'
//   );
//   public topbarImage: BehaviorSubject<string> = new BehaviorSubject<string>(
//     localStorage.getItem('topbarImage') || '1'
//   );



//   constructor(rendererFactory: RendererFactory2,private common: CommonService) {
//     this.renderer = rendererFactory.createRenderer(null, null);
//     this.common.base.subscribe((res: string) => {
//       this.base = res;
//       // if (this.base === 'layout-hovered') {
//       //   this.changeLayoutMode('13');
//       // } else if (this.base === 'layout-horizontal'){
//       //   this.changeLayoutMode('14');
//       // }else if (this.base === 'layout-detached'){
//       //   this.changeLayoutMode('5');
//       // }else if (this.base === 'layout-modern'){
//       //   this.changeLayoutMode('11');
//       // }else if (this.base === 'layout-two-column'){
//       //   this.changeLayoutMode('6');
//       // }else if (this.base === 'layout-horizontal-single'){
//       //   this.changeLayoutMode('4');
//       // }else if (this.base === 'layout-horizontal-overlay'){
//       //   this.changeLayoutMode('8');
//       // }else if (this.base === 'layout-horizontal-box'){
//       //   this.changeLayoutMode('15');
//       // }else if (this.base === 'layout-horizontal-sidemenu'){
//       //   this.changeLayoutMode('9');
//       // }else if (this.base === 'layout-vertical-transparent'){
//       //   this.changeLayoutMode('12');
//       // }else if (this.base === 'layout-without-header'){
//       //   this.changeLayoutMode('7');
//       // }else if (this.base === 'layout-rtl'){
//       //   this.changeLayoutMode('16');
//       // }else if (this.base === 'layout-box'){
//       //   this.changeLayoutWidth('2');
//       // }else if (this.base === 'layout-dark'){
//       //   this.changeThemeColor('2');
//       // }else {

//       // }
//     });
//     this.common.page.subscribe((res: string) => {
//       this.page = res;
//     });
//     this.common.last.subscribe((res: string) => {
//       this.last = res;
//     });
//   }





//   public changeLayoutMode(layout: string): void {
//     this.layoutMode.next(layout);
//     localStorage.setItem('layoutMode', layout);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-layout',
//       layout === '1'
//         ? 'default'
//         : layout === '2'
//         ? 'mini'
//         : layout === '3' || layout === '14'
//         ? 'horizontal'
//         : layout === '4'
//         ? 'horizontal-single'
//         : layout === '5'
//         ? 'detached'
//         : layout === '6'
//         ? 'twocolumn'
//         : layout === '7'
//         ? 'without-header'
//         : layout === '8'
//         ? 'horizontal-overlay'
//         : layout === '9'
//         ? 'horizontal-sidemenu'
//         : layout === '10'
//         ? 'stacked'
//         : layout === '11'
//         ? 'modern'
//         : layout === '12'
//         ? 'transparent'
//         : layout === '13'
//         ? 'layout-hovered'
//         : layout === '15'
//         ? 'horizontal-box'
//         : ''
//     );

//     if (layout === '16') {
//       this.renderer.addClass(document.body, 'layout-mode-rtl');
//     } else {
//       this.renderer.removeClass(document.body, 'layout-mode-rtl');
//     }

//   }
//   public changeLayoutWidth(width: string): void {
//     this.layoutWidth.next(width);
//     localStorage.setItem('layoutWidth', width);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-width',
//       width === '1'
//         ? 'fluid'
//         : 'box'
//     );

//   }
//   public changeCardStyle(width: string): void {
//     this.cardStyle.next(width);
//     localStorage.setItem('cardStyle', width);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-card',
//       width === '1'
//         ? 'bordered'
//         : width === '2'
//         ? 'borderless':'shadow'
//     );
//   }
//   public changeSidebarColor(sidebarColor: string): void {
//     this.sidebarColor.next(sidebarColor);
//     localStorage.setItem('sidebarColor', sidebarColor);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-sidebar',
//       sidebarColor === '1'
//         ? 'light'
//         : sidebarColor === '2'
//         ? 'darkgreen': sidebarColor === '3'
//         ? 'nightblue': sidebarColor === '4'
//         ? 'darkgray': sidebarColor === '5'
//         ? 'royalblue': sidebarColor === '6'
//         ? 'indigo':'all'
//     );
//   }
//   public changeThemeColor(themeColor: string): void {
//     this.themeColor.next(themeColor);
//     localStorage.setItem('themeColor', themeColor);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-theme',
//       themeColor === '1'
//         ? 'light'
//         : 'dark'
//     );
//   }
//   public changeSidebarSize(sidebar: string): void {
//     this.sidebarSize.next(sidebar);
//     localStorage.setItem('sidebarSize', sidebar);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-size',
//       sidebar === '1'
//         ? 'default'
//         : sidebar === '2'
//         ? 'compact'
//         : 'hoverview'
//     );
//   }
//   public changeTopbarColor(topbar: string): void {
//     this.topbarColor.next(topbar);
//     localStorage.setItem('topbarColor', topbar);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-topbar',
//       topbar === 'white'
//         ? 'white'
//         : topbar === 'darkaqua'
//         ? 'darkaqua': topbar === 'whiterock'
//         ? 'whiterock': topbar === 'rockblue'
//         ? 'rockblue': topbar === 'bluehaze'
//         ? 'bluehaze': topbar === 'orangegradient'
//         ? 'orangegradient': topbar === 'bluegradient'
//         ? 'bluegradient': topbar === 'purplegradient'
//         ? 'purplegradient': topbar === 'maroongradient'
//         ? 'maroongradient': topbar === 'all'
//         ? 'indigo':'all'
//     );
//   }
//   public changeTopbarColor2(topbar: string): void {
//     this.topbarColor2.next(topbar);
//     localStorage.setItem('topbarColor2', topbar);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-topbarcolor',
//       topbar === '1'
//         ? 'white'
//         : topbar === '2'
//         ? 'primary': topbar === '3'
//         ? 'blackpearl': topbar === '4'
//         ? 'maroon': topbar === '5'
//         ? 'bluegem': topbar === '6'
//         ? 'firefly':'all'
//     );
//   }
//   public changePrimaryColor(color: string): void {
//     this.primaryColor.next(color);
//     localStorage.setItem('primaryColor', color);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-color',
//       color === '1'
//         ? 'primary'
//         : color === '2'
//         ? 'brightblue': color === '3'
//         ? 'lunargreen': color === '4'
//         ? 'lavendar': color === '5'
//         ? 'magenta': color === '6'
//         ? 'chromeyellow' : color === '7'
//         ? 'lavared' :'all'
//     );
//   }
//   public changeLoaderState(isLoader: string): void {
//     this.isLoader.next(isLoader);
//     localStorage.setItem('isLoader', isLoader);
//     this.renderer.setAttribute(
//       document.documentElement,
//       'data-loader',
//       isLoader === '1'
//         ? 'enable'
//         : 'disable'
//     );
//   }
//   public changeSidebarImage(img: string): void {
//     this.sidebarImage.next(img);
//     localStorage.setItem('sidebarImage', img);
//     this.renderer.setAttribute(
//       document.body,
//       'data-sidebarbg',
//       img === '1'
//         ? 'sidebarbg1'
//         : img === '2'
//         ? 'sidebarbg2': img === '3'
//         ? 'sidebarbg3': img === '4'
//         ? 'sidebarbg4': img === '5'
//         ? 'sidebarbg5': img === '6'
//         ? 'sidebarbg6':''
//     );
//   }
//   public changeTopbarImage(img: string): void {
//     this.topbarImage.next(img);
//     localStorage.setItem('topbarImage', img);
//     this.renderer.setAttribute(
//       document.body,
//       'data-topbarbg',
//       img === '1'
//         ? 'pattern1'
//         : img === '2'
//         ? 'pattern2': img === '3'
//         ? 'pattern3':''
//     );
//   }
//   public changeSidebarColor2(color: string): void {
//     this.sidebarColor2.next(color);
//     localStorage.setItem('sidebarColor2', color);

//   }
//   public changeTopbarColor3(color: string): void {
//     this.topbarColor3.next(color);
//     localStorage.setItem('topbarColor3', color);

//   }
//   public changeTopbarHorizontalColor(color: string): void {
//     this.topbarColor4.next(color);
//     localStorage.setItem('topbarColor4', color);

//   }
//   public changePrimaryColor1(color: string): void {
//     this.primaryColor1.next(color);
//     localStorage.setItem('primaryColor1', color);

//   }

// }


