#!/usr/bin/env python3
'''Pagination helper function'''
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    '''Returns a tuple containing a tuple of a start and
    end index for pagination'''
    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)
