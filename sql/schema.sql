create database if not exists hackernews;
use hackernews;

create table if not exists news
(
    id             int auto_increment
    primary key,
    type           enum ('news', 'ask', 'show', 'job') default 'news'            not null,
    news_order     int                                                           not null,
    user_id        int                                                           not null,
    created_at     timestamp                           default CURRENT_TIMESTAMP not null,
    votes          int                                 default 0                 not null,
    visible        tinyint                             default 1                 not null,
    is_current     tinyint                             default 1                 not null,
    title          varchar(255)                                                  not null,
    url            varchar(300)                                                  null,
    description    text                                                          null,
    comments_count int                                 default 0                 null,
    domain         varchar(255)                                                  null
    );

create table if not exists comment
(
    id                int auto_increment
    primary key,
    user_id           int                                 not null,
    news_id           int                                 not null,
    visible           tinyint   default 1                 not null,
    parent_comment_id int                                 null,
    created_at        timestamp default CURRENT_TIMESTAMP not null,
    votes             int       default 0                 not null,
    comment           text                                not null,
    constraint fk_comment_comment1
    foreign key (parent_comment_id) references comment (id)
    on update cascade on delete cascade,
    constraint fk_comment_news1
    foreign key (news_id) references news (id)
    on update cascade on delete cascade
    );

create index fk_comment_comment1_idx
    on comment (parent_comment_id);

create index fk_comment_news1_idx
    on comment (news_id);

create index fk_comment_user1_idx
    on comment (user_id);

create index fk_news_user_idx
    on news (user_id);

create table if not exists user
(
    id            int auto_increment
    primary key,
    username      varchar(16)                         not null,
    visible       tinyint   default 1                 not null,
    email         varchar(255)                        null,
    password      varchar(32)                         not null,
    salt          varchar(45)                         not null,
    created_at    timestamp default CURRENT_TIMESTAMP not null,
    current_token varchar(45)                         null,
    last_login_at timestamp                           null
    );

create table if not exists user_content_rel
(
    id         int auto_increment
    primary key,
    created_at timestamp                            default CURRENT_TIMESTAMP not null,
    user_id    int                                                            not null,
    type       enum ('vote', 'favourite', 'report') default 'vote'            not null,
    vote       int                                  default 1                 not null,
    comment_id int                                                            null,
    news_id    int                                                            null,
    report     text                                                           null,
    constraint fk_vote_comment1
    foreign key (comment_id) references comment (id)
    on update cascade on delete cascade,
    constraint fk_vote_news1
    foreign key (news_id) references news (id)
    on update cascade on delete cascade
    );

create index fk_vote_comment1_idx
    on user_content_rel (comment_id);

create index fk_vote_news1_idx
    on user_content_rel (news_id);

create index fk_vote_user1_idx
    on user_content_rel (user_id);

