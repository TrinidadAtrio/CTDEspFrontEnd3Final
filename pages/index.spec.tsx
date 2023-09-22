import {render, screen} from "@testing-library/react";
import IndexPage from "dh-marvel/pages/index.page";
import Index from "dh-marvel/pages/index.page";
import { Comics } from "interfaces";

describe('IndexPage', () => {
  const comics = {
    code: 123,
    status: 'ok',
    copyright: '',
    attributionText: '',
    attributionHTML: '',
    etag: '',
    data: {
      total: 100,
      limit: 5,
      results: [],
      offset: 10,
      count: 10,
    }
  } as Comics;
    describe('when rendering default', () => {
        it('should render empty home', () => {
            const comp = render(<Index comics={comics} page={1}/>)
            expect(comp.baseElement).toMatchSnapshot()
        })
    })

})