
export const PAGES_MENU = [
  {
    path: 'home',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'Dashboard',
            icon: 'icon ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'materials',
        data: {
          menu: {
            title: 'Materials خامات',
            icon: 'icon ion-ios-gear-outline',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
        children: [
          {
            path: 'fabrics',
            data: {
              menu: {
                title: 'Fabrics اقمشة',
                icon: 'fa fa-scissors',
              }
            }
          }, {
            path: 'Accessories',
            data: {
              menu: {
                title: 'Accessories اكسسوار',
                icon: 'fa fa-bookmark-o',
              }
            }
          }
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Products منتجات',
            icon: 'icon ion-ios-box',
            selected: false,
            expanded: false,
            order: 200,
          }
        },
        children: [
          {
            path: 'brand',
            data: {
              menu: {
                title: 'Brands ماركات',
                icon: 'icon ion-pricetag'
              }
            }
          },
          {
            path: 'model',
            data: {
              menu: {
                title: 'Models موديلات',
                icon: 'icon ion-pricetags'
              }
            },
          }
        ]
      },
      {
        path: 'purchase',
        data: {
          menu: {
            title: 'Purchases المشتريات',
            icon: 'fa fa-dollar',
            selected: false,
            expanded: false,
            order: 300,
          }
        },
        children: [
          {
            path: 'supplier',
            data: {
              menu: {
                title: 'Suppliers الموردين',
                icon: 'fa fa-users'
              }
            }
          }
        ]
      },
      {
        path: 'matstore',
        data: {
          menu: {
            title: 'Material Store مخزن الخامات',
            icon: 'fa fa-dashboard',
            selected: false,
            expanded: false,
            order: 400,
          }
        },
        children: [
          {
            path: 'balance',
            data: {
              menu: {
                title: 'Balance الرصيد',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'matinsp',
            data: {
              menu: {
                title: 'Inspection الفحص',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'matrec',
            data: {
              menu: {
                title: 'Receiving الاستلام',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'matdisp',
            data: {
              menu: {
                title: 'Dispensing الصرف',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'matequl',
            data: {
              menu: {
                title: 'Equalization التسوية',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'matret',
            data: {
              menu: {
                title: 'Return الارتجاع',
                icon: 'fa fa-circle-o'
              }
            }
          }
        ]
      },
      {
        path: 'finish',
        data: {
          menu: {
            title: 'Fin. Store مخزن المنتج النهائي',
            icon: 'fa fa-dashboard',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'balance',
            data: {
              menu: {
                title: 'Balance الرصيد',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'barcode',
            data: {
              menu: {
                title: 'Print Barcode طباعة باركود',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'finrec',
            data: {
              menu: {
                title: 'Receiving الاستلام',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'findisp',
            data: {
              menu: {
                title: 'Dispensing الصرف',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'finequl',
            data: {
              menu: {
                title: 'Equalization التسوية',
                icon: 'fa fa-circle-o'
              }
            }
          },
          {
            path: 'finret',
            data: {
              menu: {
                title: 'Return الارتجاع',
                icon: 'fa fa-circle-o'
              }
            }
          }
        ]
      },
      {
        path: 'sales',
        data: {
          menu: {
            title: 'Sales المبيعات',
            icon: 'fa fa-dollar',
            selected: false,
            expanded: false,
            order: 600,
          }
        },
        children: [
          {
            path: 'customer',
            data: {
              menu: {
                title: 'Customers العملاء',
                icon: 'fa fa-users'
              }
            }
          },
          {
            path: 'order',
            data: {
              menu: {
                title: 'Orders طلبات البيع',
                icon: 'fa fa-dollar'
              }
            }
          },
          {
            path: 'payment',
            data: {
              menu: {
                title: 'Payments استلام دفعات',
                icon: 'fa fa-dollar'
              }
            }
          },
          {
            path: 'commission',
            data: {
              menu: {
                title: 'Commissions عمولة البيع',
                icon: 'fa fa-dollar'
              }
            }
          },
          {
            path: 'salesrep',
            data: {
              menu: {
                title: 'Sales Rep. مندوبين البيع',
                icon: 'fa fa-dollar'
              }
            }
          }
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Admin',
            icon: 'fa fa-key',
            selected: false,
            expanded: false,
            hidden: JSON.parse(localStorage.getItem('currentUser')) == null ? true : JSON.parse(localStorage.getItem('currentUser')).isAdmin == false,
            order: 800,
          }
        },
        children: [
          {
            path: '',
            data: {
              menu: {
                title: 'System Users المستخدمين',
                icon: 'fa fa-users'
              }
            }
          }
        ]
      },
      {
        path: 'reports',
        data: {
          menu: {
            title: 'Reports التقارير',
            icon: 'icon ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
    ]
  }
];
