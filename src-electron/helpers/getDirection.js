export default (info) => {
  return info.right_to_left === 'true' ? {
      nt: 'rtl',
      ot: 'rtl'
    }
    : info.right_to_left_nt === 'true' ? {
        nt: 'rtl',
        ot: 'ltr'
      }
      : info.right_to_left_ot === 'true' ? {
          nt: 'ltr',
          ot: 'rtl'
        }
        : {
          nt: 'ltr',
          ot: 'ltr'
        }
}
