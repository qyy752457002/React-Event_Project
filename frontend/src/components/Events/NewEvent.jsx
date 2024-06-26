import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate(); // 获取导航函数

  // 使用 useMutation hook 定义创建新事件的异步操作
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent, // 转变函数
    onSuccess: () => { // 请求成功后的处理函数
      queryClient.invalidateQueries({ queryKey: ['events'] }); // 立即标记 'events' 查询键下的数据为 stale，这会触发客户端向服务器请求最新的 'events' 查询键下的数据
      navigate('/events'); // 导航到事件列表页
    },
  });

  // 提交表单数据 (formData) 处理函数
  function handleSubmit(formData) {
    // { event: formData } 对应 createNewEvent 函数 里 传进 的 eventData
    mutate({ event: formData }); // 调用 mutate 函数发起异步请求
  }

  return (
    <Modal onClose={() => navigate('../')}>
      {/* 显示事件表单 */}
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && (
          <>
            {/* 显示取消按钮 */}
            <Link to="../" className="button-text">
              Cancel
            </Link>
            {/* 显示创建按钮 */}
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {/* 显示错误提示 */}
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            'Failed to create event. Please check your inputs and try again later.'
          }
        />
      )}
    </Modal>
  );
}
