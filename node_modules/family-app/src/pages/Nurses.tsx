import React, { useState } from 'react';
import { Card, Button, Avatar, Tag, Tabs, SearchBar } from 'antd-mobile';
import { UserOutline, PhonebookOutline, CalendarOutline, StarOutline, StarFill, MessageOutline } from 'antd-mobile-icons';
import styles from './Nurses.module.css';

interface Nurse {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: string;
  experience: string;
  rating: number;
  specialties: string[];
  price: number;
  status: 'online' | 'offline' | 'busy';
  description: string;
  reviews: number;
  distance: string;
  availability: number;
  bookingStatus: string;
}

const Nurses: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const nurses: Nurse[] = [
    {
      id: '1',
      name: '王护士',
      age: 35,
      gender: '女',
      experience: '5年经验',
      rating: 4.9,
      specialties: ['居家护理', '医疗护理'],
      price: 80,
      status: 'online',
      description: '专业护理师，擅长老年日常护理和康复训练',
      reviews: 128,
      distance: '2.5km',
      availability: 98,
      bookingStatus: '立即可约',
    },
    {
      id: '2',
      name: '李护士',
      age: 28,
      gender: '女',
      experience: '3年经验',
      rating: 4.6,
      specialties: ['康复护理', '营养配餐'],
      price: 60,
      status: 'online',
      description: '细心耐心，有丰富的陪护经验',
      reviews: 95,
      distance: '1.8km',
      availability: 95,
      bookingStatus: '明日可约',
    },
    {
      id: '3',
      name: '张阿姨',
      age: 42,
      gender: '女',
      experience: '8年经验',
      rating: 4.9,
      specialties: ['专业护理', '营养配餐', '康复训练'],
      price: 100,
      status: 'busy',
      description: '资深护理师，擅长专业护理和营养配餐',
      reviews: 256,
      distance: '3.2km',
      availability: 85,
      bookingStatus: '明日可约',
    },
  ];

  const tabs = [
    { key: 'all', title: '全部' },
    { key: 'home', title: '居家护理' },
    { key: 'medical', title: '医疗护理' },
    { key: 'rehab', title: '康复护理' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'default';
      case 'busy':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'busy':
        return '忙碌';
      default:
        return '未知';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="star">
          {i <= rating ? <StarFill /> : <StarOutline />}
        </span>
      );
    }
    return stars;
  };

  const handleContact = (nurse: Nurse, type: 'call' | 'message') => {
    if (type === 'call') {
      console.log('拨打电话给:', nurse.name);
    } else {
      console.log('发送消息给:', nurse.name);
    }
  };

  const filteredNurses = nurses.filter(nurse => {
    if (activeTab === 'home' && !nurse.specialties.includes('居家护理')) return false;
    if (activeTab === 'medical' && !nurse.specialties.includes('医疗护理')) return false;
    if (activeTab === 'rehab' && !nurse.specialties.includes('康复护理')) return false;
    if (searchValue && !nurse.name.includes(searchValue)) return false;
    return true;
  });

  return (
    <div className={styles.nurses}>
      {/* 搜索栏 */}
      <div className={styles.searchContainer}>
        <SearchBar
          className={styles.searchBar}
          placeholder="搜索护工姓名、技能"
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {/* 筛选标签 */}
      <div className={styles.filterTabs}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.Tab title="居家护理" key="home" />
          <Tabs.Tab title="医疗护理" key="medical" />
          <Tabs.Tab title="康复护理" key="rehabilitation" />
        </Tabs>
      </div>

      {/* 护工列表 */}
      <div className={styles.nursesList}>
        {filteredNurses.map((nurse) => (
          <Card key={nurse.id} className={styles.nurseCard}>
            <div className={styles.nurseHeader}>
              <div className={styles.nurseInfo}>
                <Avatar
                  className={styles.nurseAvatar}
                  src={nurse.avatar || ''}
                />
                <div className={styles.nurseDetails}>
                  <div className={styles.nurseName}>{nurse.name}</div>
                  <div className={styles.nurseBasic}>
                    {nurse.age}岁 · {nurse.gender} · {nurse.experience}年经验
                  </div>
                  <div className={styles.nurseRating}>
                    <div className={styles.ratingText}>{nurse.rating}</div>
                    <div className={styles.reviewsCount}>({nurse.reviews}条评价)</div>
                  </div>
                </div>
              </div>
              <div className={styles.nursePrice}>
                <div className={styles.priceValue}>¥{nurse.price}</div>
                <div className={styles.priceUnit}>/小时</div>
              </div>
            </div>

            <div className="nurse-specialties">
              {nurse.specialties.map((specialty, index) => (
                <Tag key={index} color="primary" fill="outline">
                  {specialty}
                </Tag>
              ))}
            </div>

            <div className="nurse-availability">
              <div className="availability-item">
                <span className="availability-label">距离：</span>
                <span className="availability-value">{nurse.distance}</span>
              </div>
              <div className="availability-item">
                <span className="availability-label">可用性：</span>
                <span className="availability-value">{nurse.availability}%</span>
              </div>
              <div className="availability-item">
                <span className="availability-label">预约状态：</span>
                <span className="availability-value">{nurse.bookingStatus}</span>
              </div>
            </div>

            <div className="nurse-description">
              {nurse.description}
            </div>

            <div className="nurse-actions">
              <Button
                size="small"
                fill="outline"
                onClick={() => handleContact(nurse, 'message')}
                className="action-btn"
              >
                <MessageOutline />
                查看详情
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => handleContact(nurse, 'call')}
                className="action-btn"
              >
                <PhonebookOutline />
                立即预约
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 快速预约按钮 */}
      <Button
        className="quick-booking-button"
        color="primary"
        size="large"
        block
      >
        快速预约护工
      </Button>
    </div>
  );
};

export default Nurses;
