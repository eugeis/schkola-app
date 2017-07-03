import { SchkolaAppPage } from './app.po';

describe('schkola-app App', () => {
  let page: SchkolaAppPage;

  beforeEach(() => {
    page = new SchkolaAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
