window.onload = function() {
  const sidebar = createSidebar();
  document.body.insertBefore(sidebar, document.body.firstChild);

  // 초기 헤더 넓이 조정
  adjustHeaderWidth();
  window.addEventListener('resize', adjustHeaderWidth);

  sidebar.addEventListener('transitionend', adjustHeaderWidth); // 사이드바의 트랜지션 끝난 후 헤더 조정
};

function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  sidebar.classList.add('sidebar');

  const sidebarContent = document.createElement('div');
  sidebarContent.classList.add('sidebar-content');

  const menuItems = getMenuItems();
  const ul = document.createElement('ul');

  menuItems.forEach(item => {
    const li = createMenuItem(item);
    ul.appendChild(li);
  });

  sidebarContent.appendChild(ul);
  sidebar.appendChild(sidebarContent);

  return sidebar;
}

function getMenuItems() {
  return [
    {
      href: "#",
      iconSrc: "../../public/images/fast_campus_logo_toggle.png",
      hoverIconSrc: "../../public/images/fast_campus_logo.png",
      isLogo: true // 사이드바의 로고 항목 표시
    },
    {
      href: "#user-profile",
      iconSrc: "../../public/images/user1.png",
      hoverIconSrc: "../../public/images/iconsettings.svg",
      text1: "User",
      text2: "helloworld@gmail.com",
      className: "user-item"
    },
    {
      href: "#",
      iconSrc: "../../public/images/iconHome.svg",
      text: "홈"
    },
    {
      href: "#",
      iconSrc: "../../public/images/iconBoard.svg",
      text: "게시판",
      subItems: [
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "공지사항"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "문의 게시판"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "행정 자료 요청"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "기업 공지 모음 갤러리"
        }
      ]
    },
    {
      href: "#",
      iconSrc: "../../public/images/iconCalendar.svg",
      text: "출결 관리",
      subItems: [
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "입퇴실 기록"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "외출 조퇴 관리"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "휴가 관리"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "공가 관리"
        },
        {
          href: "#",
          iconSrc: "../../public/images/category.svg",
          text: "출결 현황 확인"
        }
      ]
    },
    {
      href: "#",
      iconSrc: "../../public/images/iconUser1.svg",
      text: "내 프로필"
    },
    {
      href: "#",
      iconSrc: "../../public/images/iconToggle.svg",
      isBottom: true // 사이드바 맨 아래에 위치
    },
  ];
}

function createMenuItem(item) {
  const li = document.createElement('li');

  if (item.isLogo) {
    li.classList.add('logo');
    const logoContainer = createLogoContainer(item);
    li.appendChild(logoContainer);
  } else if (item.isBottom) {
    li.classList.add('bottom');
    const iconElement = createIconElement(item.iconSrc, item.text);
    li.appendChild(iconElement);
  } else if (item.className === "user-item") {
    li.classList.add(item.className);

    const userIcon = document.createElement('img');
    userIcon.src = item.iconSrc;
    userIcon.alt = item.text1 || 'User';
    userIcon.classList.add('user-icon');

    const hoverIcon = document.createElement('img');
    hoverIcon.src = item.hoverIconSrc;
    hoverIcon.alt = 'Settings';
    hoverIcon.classList.add('hover-icon');

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    const spanText1 = document.createElement('span');
    spanText1.classList.add('text1');
    spanText1.textContent = item.text1;

    const spanText2 = document.createElement('span');
    spanText2.classList.add('text2');
    spanText2.textContent = item.text2;

    textContainer.appendChild(spanText1);
    textContainer.appendChild(spanText2);

    li.appendChild(userIcon);
    li.appendChild(hoverIcon);
    li.appendChild(textContainer);

    hoverIcon.addEventListener('mouseover', function() {
      hoverIcon.classList.add('icon-red-filter');
    });

    hoverIcon.addEventListener('mouseout', function() {
      hoverIcon.classList.remove('icon-red-filter');
    });

    li.addEventListener('click', function() {
      window.location.href = item.href;
    });
  } else {
    const a = document.createElement('a');
    a.href = item.href;

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon');
    const iconElement = createIconElement(item.iconSrc, item.text);
    iconSpan.appendChild(iconElement);

    const spanText = document.createElement('span');
    spanText.classList.add('text');
    spanText.textContent = item.text;

    a.appendChild(iconSpan);
    a.appendChild(spanText);

    li.appendChild(a);

    addHoverEffect(a, iconElement);

    if (item.subItems && item.subItems.length > 0) {
      const subUl = document.createElement('ul');
      subUl.classList.add('submenu');

      item.subItems.forEach(subItem => {
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = subItem.href;

        const subIconSpan = document.createElement('span');
        subIconSpan.classList.add('sub-icon');
        const subIconElement = createIconElement(subItem.iconSrc, subItem.text);
        subIconSpan.appendChild(subIconElement);

        const subText = document.createElement('span');
        subText.classList.add('sub-text');
        subText.textContent = subItem.text;

        subA.appendChild(subIconSpan);
        subA.appendChild(subText);
        subLi.appendChild(subA);
        subUl.appendChild(subLi);

        addHoverEffect(subA, subIconElement); // 서브아이템에 대한 필터 효과 추가
      });

      li.appendChild(subUl);
    }
  }

  return li;
}

function createLogoContainer(item) {
  const logoContainer = document.createElement('div');
  logoContainer.classList.add('logo-container');

  const defaultLogoImg = document.createElement('img');
  defaultLogoImg.src = item.iconSrc;
  defaultLogoImg.alt = item.text || 'Logo';
  defaultLogoImg.classList.add('logo-default');

  const hoverLogoImg = document.createElement('img');
  hoverLogoImg.src = item.hoverIconSrc;
  hoverLogoImg.alt = item.text || 'Hover Logo';
  hoverLogoImg.classList.add('logo-hover');

  logoContainer.appendChild(defaultLogoImg);
  logoContainer.appendChild(hoverLogoImg);

  return logoContainer;
}

function createIconElement(src, alt) {
  const iconElement = document.createElement('img');
  iconElement.src = src;
  iconElement.alt = alt || 'Icon';
  return iconElement;
}

function addHoverEffect(element, iconElement) {
  element.addEventListener('mouseover', function() {
    iconElement.classList.add('icon-red-filter');
  });
  element.addEventListener('mouseout', function() {
    iconElement.classList.remove('icon-red-filter');
  });
}

function addClickEffect(element) {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    resetActiveLinks();
    element.classList.add('active');
  });
}

function resetActiveLinks() {
  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => link.classList.remove('active'));
}
